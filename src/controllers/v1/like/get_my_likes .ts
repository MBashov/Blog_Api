//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Like from '../../../models/like.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const getMyLikes = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    console.log(userId);
    
    try {
        const likes = await Like.find({ userId })
            .sort({ createdAt: -1 })
            .populate('blogId', '-createdAt -updatedAt -__v')
            .lean()
            .exec();

        res.status(200).json({ likes });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error retrieving user\'s likes', err);
    }
}

export default getMyLikes;