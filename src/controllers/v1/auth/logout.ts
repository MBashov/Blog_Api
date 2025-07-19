//* Custom modules
import { logger } from '../../../lib/winston.ts';
import config from '../../../config/index.ts';

//* Models
import Token from '../../../models/token.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts'


const logout = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken as string;

        if (refreshToken) {
            await Token.deleteOne({ token: refreshToken });

            logger.info('User refresh token deleted successfully', {
                userId: req.userId,
                token: refreshToken,
            });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.sendStatus(204);

        logger.info('User logged out successfully', {
            userId: req.userId,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        })
        logger.error('Error during user logout', err);
    }
};

export default logout;