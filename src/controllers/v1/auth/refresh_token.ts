//* Node modules
import pkg from 'jsonwebtoken';

//* Custom modules
import { logger } from '../../../lib/winston.ts';
import { verifyRefreshToken, verifyAccessToken, generateAccessToken } from '../../../lib/jwt.ts';

//* Models
import Token from '../../../models/token.ts';

//*Types
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import type { UserIdOnly } from '../../../types/users';

const { JsonWebTokenError, TokenExpiredError } = pkg;

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;

    try {
        const tokenExist: UserIdOnly = await Token.exists({ token: refreshToken });

        if (!tokenExist) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        //Verify refresh token
        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken
        });

    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token expired, please login again',
            });
            return;
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        })
        logger.error('Error during refresh token', err);

    }
}

export default refreshToken;
