//* Node Modules
import { param } from 'express-validator';

export const blogIdValidator = [
    param('blogId')
        .trim()
        .isMongoId()
        .withMessage('Invalid blog ID'),
];