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
import type { IUser } from '../../../types/users'; 

type UserData = Pick<IUser, 'email' | 'password' | 'role'>; //TODO: export type?

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

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
                email: newUser.email,
                role: newUser.role,
            },
            accessToken,
        });

        logger.info('User registered successfully', {
            username: newUser.username,
            email: newUser.email,
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