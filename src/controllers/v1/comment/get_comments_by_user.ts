//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Comment from '../../../models/comment.ts';
import User from '../../../models/user.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const getCommentsByUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const currentUserId = req.userId;
    
    try {
        const userExist = await User.exists({ _id: userId });
        if (!userExist) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }

        const currentUser = await User.findById(currentUserId).select('role').lean().exec();
        
        if (currentUser?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });
            logger.info('Access denied: User attempted to fetch comments of another user without admin privileges', {
                currentUserId,
                targetUserId: userId,
            });
            return;
        }

        const comments = await Comment.find({ userId })
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