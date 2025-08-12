//* Custom modules
import { logger } from '../../../lib/winston.ts';
import config from '../../../config/index.ts';

//* Models
import Blog from '../../../models/blog.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const searchBlogs = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;
        const query = req.query.q || '';

        const blogs = await Blog.find({ title: { $regex: query, $options: 'i' } })
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .sort({ viewsCount: -1 })
            .limit(limit)
            .lean()
            .exec();

        res.status(200).json({ blogs });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while fetching blogs', err);
    }
}

export default searchBlogs;