//* Modules
import { v2 as cloudinary } from 'cloudinary';

//* Custom modules
import { logger } from "../../../lib/winston.ts";

//* Models
import User from "../../../models/user.ts";
import Blog from '../../../models/blog.ts';

//* Types
import type { Response } from "express";
import type { CustomRequest } from "../../../types/Request.ts";
import Like from '../../../models/like.ts';
import Comment from '../../../models/comment.ts';

const deleteCurrentUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;

    try {
        const blogs = await Blog.find({ author: userId }).select('banner.publicId').lean().exec();

        const publicIds = blogs.map(({ banner }) => banner.publicId);

        if (publicIds.length) {
            await cloudinary.api.delete_resources(publicIds);
            logger.info('Multiple blog banners deleted from cloudinary', {
                publicIds
            });

        }

        await Blog.deleteMany({ author: userId });
        logger.info('Multiple blogs deleted', {
            userId,
            blogs,
        });

        await Like.deleteMany({ userId });
        logger.info('Multiple likes deleted', {
            userId,
            blogs,
        });

        await Comment.deleteMany({ author: userId });
        logger.info('Multiple comments deleted', {
            userId,
            blogs,
        });

        await User.deleteOne({ _id: userId });

        logger.info('A user account has been deleted', userId);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while deleting current user account', err);
    }
}

export default deleteCurrentUser;