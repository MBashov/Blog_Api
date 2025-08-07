//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Comment from '../../../models/comment.ts';
import User from '../../../models/user.ts';

//* Types
import type { Request, Response } from 'express';

const getCommentsByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    
    try {
        const userExist = await User.exists({ _id: userId });
        if (!userExist) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }

        const comments = await Comment.find({ author: userId })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        res.status(200).json({ comments });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error retrieving user\'s comments', err);
    }
}

export default getCommentsByUser;