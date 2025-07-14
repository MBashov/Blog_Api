//* Custom modules
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.ts';
import { logger } from '../../../lib/winston.ts';
import config from '../../../config/index.ts';

//* Models
import Token from '../../../models/token.ts';
import User from '../../../models/user.ts';

//* Types
import type { Request, Response } from 'express';
import type { IUser } from '../../../models/user.ts';

type userData = Pick<IUser, 'email' | 'password'>

const login = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as userData;

    try {
        const user = await User.findOne({ email }) //TODO: Use type allies for user?
            .select('username email password role')
            .lean()
            .exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }

        // Generate access and refresh token for new user
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token to db
        await Token.create({ token: refreshToken, userId: user._id });
        logger.info('Refresh token created for user', {
            userId: user._id,
            token: refreshToken,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(201).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });

        logger.info('User login successfully', user);

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        })
        logger.error('Error during user login', err);
    }
};

export default login;