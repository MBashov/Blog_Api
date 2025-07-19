//* Node modules
import DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';

//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';

//* Middlewares

//* Types
import type { Response } from 'express';
import type { BlogData } from '../../../types/BlogData.ts';
import type { CustomRequest } from '../../../types/Request.ts';

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { title, content, banner, status } = req.body as BlogData;
        const userId = req.userId;

        const cleanContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content: cleanContent,
            banner,
            status,
            author: userId,
        });

        logger.info('New blog created', newBlog);

        res.status(201).json({
            code: newBlog,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error during creating a blog', err);
    }
}

export default createBlog;