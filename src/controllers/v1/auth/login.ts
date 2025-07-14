//* Node modules
import bcrypt from 'bcrypt';

//* Custom modules
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.ts';
import { logger } from '../../../lib/winston.ts';
import config from '../../../config/index.ts';

//* Models
import User from '../../../models/user.ts';
import Token from '../../../models/token.ts';

//* Types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

//TODO: Export interface to separate module
interface UserLoginData {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as UserLoginData;

    try {
        const user: UserLoginData | null = await User.findOne({ email })
            .select('username password role _id')
            .lean()
            .exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Email or password is invalid',
            });

            logger.warn('Email or password is invalid');
            return;
        }

        // Check password
        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Email or password is invalid',
            });

            logger.warn('Email or password is invalid');
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

        logger.info('User login successfully', {
            username: user.username,
            email: user.email,
            role: user.role,
        });

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