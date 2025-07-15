//* Custom modules
import { logger } from "../../../lib/winston.ts";
import config from "../../../config/index.ts";

//* Models
import User from "../../../models/user.ts";

//* Types
import type { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;
        const totalUsers = await User.countDocuments();

        const users = await User.find()
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();

        res.status(200).json({
            limit,
            offset,
            totalUsers,
            users,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while getting all users', err);
    }
}

export default getAllUsers;