//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Comment from '../../../models/comment.ts';

//* Types
import type { Request, Response } from 'express';

const getCommentsByBlog = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.blogId;

    try {
        const blog = await Blog.findById(blogId).select('_id').lean().exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found'
            });
            return;
        }

        const allComments = await Comment.find({ blogId })
            .sort({ publishedAt: 1 })
            .select('-__V')
            .populate('author', '_id firstName lastName')
            .lean()
            .exec();

        res.status(200).json({
            comments: allComments
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error retrieving comments', err);
    }
}

export default getCommentsByBlog;