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

const getBlogsByUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.userId;

        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;

        const currentUser = await User.findById(currentUserId).select('role').lean().exec();
        const query: QueryType = {};

        // Show only published posts to a normal user
        if (currentUser?.role === 'user') {
            query.status = 'published';
        }
        
        const totalBlogs = await Blog.countDocuments({ author: userId, ...query});
        const blogs = await Blog.find({ author: userId, ...query})
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

        logger.error('Error while fetching blogs by user', err);
    }
}

export default getBlogsByUser;