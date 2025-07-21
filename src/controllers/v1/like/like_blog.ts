//* Node modules
import DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';

//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Like from '../../../models/like.ts';

//* Middlewares

//* Types
import type { Request, Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const likeBlog = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const blogId = req.params.blogId;
    
    try {
        const blog = await Blog.findById(blogId).select('likesCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found'
            });
            return;
        }

        const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
        if (existingLike) {
            res.status(400).json({
                code: 'BadRequest',
                message: 'You have already liked this blog',
            });
            return;
        }

        await Like.create({ blogId, userId });

        blog.likesCount++;
        await blog.save();

        logger.info('Blog liked successfully', {
            userId,
            blogId,
            likesCount: blog.likesCount,
        });
        
        res.status(200).json({
            likesCount: blog.likesCount,
        });

     } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while liking a blog', err);
    }
}

export default likeBlog;