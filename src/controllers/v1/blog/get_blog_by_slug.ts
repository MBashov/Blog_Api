//* Custom modules
import { logger } from '../../../lib/winston.ts';

//* Models
import User from '../../../models/user.ts';
import Blog from '../../../models/blog.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const getBlogBySlug = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const slug = req.params.slug;
        
        const user = await User.findById(userId).select('role _id').lean().exec();
        const blog = await Blog.findOne({ slug })
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .exec();

        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        if (blog.status === 'draft' && (!user || (user.role !== 'admin' && !blog.author._id.equals(user._id)))) {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });
            logger.info('Unauthorized draft access attempt', {
                userId: user?._id,
                blogId: blog._id,
            });
            return;
        }
        
        if (!user || !blog.author._id.equals(user._id)) {
            await Blog.updateOne({ slug }, { $inc: { viewsCount: 1 } }).exec();
        }

        res.status(200).json({ blog });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while fetching blog by slug', err);
    }
}

export default getBlogBySlug;