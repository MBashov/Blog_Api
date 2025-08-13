//* Node Modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Comment from '../../../models/comment.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';
import type { CommentData } from '../../../types/IComments.ts';
import User from '../../../models/user.ts';

// Purify comment content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateComment = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const commentId = req.params.commentId;
    const { content } = req.body as CommentData;

    try {
        const user = await User.findById(userId).select('role').lean().exec()
        const comment = await Comment.findById(commentId).select('_id author content').exec();

        if (!comment) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Comment not found',
            });
            return;
        }

        if (!comment.author.equals(userId) && user?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });

            logger.info('User attempted to update a comment without sufficient permissions', {
                userId,
                comment,
            });
            return;
        }

        if (content) {
            const cleanContent = purify.sanitize(content);
            comment.content = cleanContent;
        }

        await comment.save();

        logger.info('Comment updated successfully', { comment });

        res.status(200).json({ comment });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while updating a comment', err);
    }
}

export default updateComment;