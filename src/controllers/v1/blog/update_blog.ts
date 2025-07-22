//* Node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import User from '../../../models/user.ts';

//* Middlewares

//* Types
import type { Response } from 'express';
import type { BlogData } from '../../../types/blogs';
import type { CustomRequest } from '../../../types/Request.ts';

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { title, content, banner, status } = req.body as Partial<BlogData>;
        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select('role').lean().exec();
        const blog = await Blog.findById(blogId).select('-__v').exec();

        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        console.log(blog.author._id.equals(userId));
        
        if (!blog.author._id.equals(userId) && user?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });

            logger.info('User attempted to update a blog without sufficient permissions', {
                userId,
                blog,
            });
            return;
        }

        if (title) blog.title = title;
        if (content) {
            const cleanContent = purify.sanitize(content);
            blog.content = cleanContent;
        }
        if (banner) blog.banner = banner;
        if (status) blog.status = status;

        await blog.save();
        logger.info('Blog updated successfully', { blog });

        res.status(200).json({
            blog
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while updating a blog', err);
    }
}

export default updateBlog;