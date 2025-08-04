//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Like from '../../../models/like.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const checkHasLiked = async (req: CustomRequest, res: Response): Promise<void> => {
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

        const existingLike = await Like.findOne({ blogId, userId }).exec();
 
        res.status(200).json({
            hasLiked: !!existingLike
        });

     } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while checking if a user has liked a blog', err);
    }
}

export default checkHasLiked;