//* Custom modules
import { logger } from "../../../lib/winston.ts";

//* Models
import User from "../../../models/user.ts";

//* Types
import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select('-__v').lean().exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({ user });
        
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while getting current user', err);
    }
}

export default getCurrentUser;