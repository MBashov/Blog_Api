//* Node Modules
import { param } from 'express-validator';

export const likeValidator = [
    param('blogId')
        .trim()
        .isMongoId()
        .withMessage('Invalid blog ID'),
];