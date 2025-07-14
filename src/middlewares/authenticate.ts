//* Node modules
import pkg from 'jsonwebtoken';

//* Custom modules
import { verifyAccessToken } from '../lib/jwt.ts';
import { logger } from '../lib/winston.ts';

//* Types
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const { JsonWebTokenError, TokenExpiredError } = pkg;
/**
 * @function authenticate
 * @description MIddleware to verify user's access token from the Authorization header.
 *              If the token is valid, the user's ID is attached to the request object.
 *              Otherwise returns appropriate error response.
 * @param {Request} req - Express request object. Expects a Bearer token in the Authorization header.
 * @param {Response} res - Express response object used to send error response if authentication fails.
 * @param {NextFunction} next - Express next function to pass control to the next middleware.
 * 
 * @returns {void}
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // If there is no Bearer token respond with 401 Unauthorized
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, not token provided'
        });
        return;
    }

    // Split out the token from the 'Bearer' prefix
    const [_, token] = authHeader.split(' ');

    try {
        // Verify token and extract the userId from payload
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        // Attach useeId to the request object for later use
        req.userId = jwtPayload.userId;

        return next();

    } catch (err) {
        // Handle expired token error
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new one with refresh token',
            });
            return;
        }
        // Handle invalid token error
        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid access token',
            });
            return;
        }

        // Catch-all for other errors
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });
        logger.error('Error during authentication', err);
    }
};


export default authenticate;