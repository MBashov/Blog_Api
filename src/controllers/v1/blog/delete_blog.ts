//* Node modules
import { v2 as cloudinary } from 'cloudinary';

//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import User from '../../../models/user.ts';

//* Middlewares

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const deleteBlog = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select('role').lean().exec();
        const blog = await Blog.findById(blogId).select('author banner.publicId').lean().exec();

        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        if (!blog.author._id.equals(userId) && user?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });

            logger.info('User attempted to delete a blog without sufficient permissions', {
                userId,
                blog,
            });
            return;
        }

        await cloudinary.uploader.destroy(blog.banner.publicId);
        logger.info('Blog banner deleted from cloudinary', {
            publicId: blog.banner.publicId
        });

        await Blog.deleteOne({ _id: blogId });
        logger.info('Blog deleted successfully');

        res.sendStatus(204);

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while deleting a blog', err);
    }
}

export default deleteBlog;