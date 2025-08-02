//* Custom modules
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.ts';
import { logger } from '../../../lib/winston.ts';
import { genUserName } from '../../../utils/gen_unique_name.ts';
import config from '../../../config/index.ts';

//* Models
import User from '../../../models/user.ts';
import Token from '../../../models/token.ts';

//* Types
import type { Request, Response } from 'express';
import type { RegisterUserData } from '../../../types/users';


const register = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, role } = req.body as RegisterUserData;

    if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You cannot register as an admin',
        });

        logger.warn(`User with email ${email} tried to register as an admin, but is not in the whitelist`);
        return;
    }

    try {
        const username = genUserName();

        const newUser = await User.create({
            username,
            firstName,
            lastName,
            email,
            password,
            role,
        });

        // Generate access token and refresh token for new user
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Store refresh token to db
        await Token.create({ token: refreshToken, userId: newUser._id });
        logger.info('Refresh token created for user', {
            userId: newUser._id,
            token: refreshToken,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(201).json({
            user: {
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                _id: newUser._id,
                role: newUser.role,
            },
            accessToken,
        });

        logger.info('User registered successfully', {
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        })
        logger.error('Error during user registration', err);
    }
};

export default register;