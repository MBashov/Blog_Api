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

// Purify comment content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createComment = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const blogId = req.params.blogId;
    const { content } = req.body as CommentData;
    
    try {
        const blog = await Blog.findById(blogId).select('_id commentsCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found'
            });
            return;
        }

        const cleanContent = purify.sanitize(content);

        const newComment = await Comment.create({
            blogId,
            userId,
            content: cleanContent,
        });
        logger.info('New comment created', { newComment });

        
        blog.commentsCount++;
        await blog.save();
        logger.info('Blog comments count updated', { 
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });

        res.status(201).json({
            comment: newComment,
        });

     } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error commenting a blog', err);
    }
}

export default createComment;