//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Comment from '../../../models/comment.ts';
import User from '../../../models/user.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const deleteComment = async (req: CustomRequest, res: Response): Promise<void> => {
    const commentId = req.params.commentId;
    const currentUserId = req.userId;

    try {
        const comment = await Comment.findById(commentId).select('userId blogId').lean().exec();
        if (!comment) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Comment not found'
            });
            return;
        }
        
        const user = await User.findById(currentUserId).select('role').lean().exec();
        
        if (!comment.userId.equals(currentUserId) && user?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });
            
            logger.info('A user tried to delete a comment without a permission', {
                userId: currentUserId,
                comment,
            });
            return;
        }
        
        await Comment.deleteOne({ _id: commentId });
        logger.info('Comment deleted successfully', {
            commentId
        });
        
        const blog = await Blog.findById({ _id: comment.blogId }).select('commentsCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        blog.commentsCount = Math.max(0, blog.commentsCount - 1); // Prevent negative count
        await blog.save();

        logger.info('Blog comments count updated', {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });

        res.status(200).json({
            commentsCount: blog.commentsCount,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while deleting comment', err);
    }
}

export default deleteComment;