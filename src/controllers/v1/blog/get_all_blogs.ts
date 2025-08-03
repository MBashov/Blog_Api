//* Custom modules
import { logger } from '../../../lib/winston.ts';
import config from '../../../config/index.ts';

//* Models
import User from '../../../models/user.ts';
import Blog from '../../../models/blog.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';
import type { QueryType } from '../../../types/blogs';

const getAllBlogs = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;

        const user = await User.findById(userId).select('role').lean().exec();
        const query: QueryType = {};

        // Show only published posts to a normal user
        if (user?.role === 'user') {
            query.status = 'published';
        }
    
        const totalBlogs = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .limit(limit)
            .skip(offset)
            .sort({ publishedAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            limit,
            offset,
            totalBlogs,
            blogs,
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while fetching blogs', err);
    }
}

export default getAllBlogs;