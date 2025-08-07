//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Comment from '../../../models/comment.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const getMyComments = async (req: CustomRequest, res: Response): Promise<void> => {
    const author = req.userId;
    console.log(author);
    
    try {
        const comments = await Comment.find({ author })
            .sort({ createdAt: -1 })
            .populate('blogId', '-createdAt -updatedAt -__v')
            .lean()
            .exec();

        res.status(200).json({ comments });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error retrieving user\'s comments', err);
    }
}

export default getMyComments;