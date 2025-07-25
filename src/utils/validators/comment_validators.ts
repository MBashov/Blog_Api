//* Node Modules
import { body, param } from 'express-validator';

export const commentValidator = [
    param('blogId')
        .trim()
        .isMongoId()
        .withMessage('Invalid blog ID'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
];

export const commentIdValidator = [
    param('commentId')
        .trim()
        .isMongoId()
        .withMessage('Invalid comment ID'),
];