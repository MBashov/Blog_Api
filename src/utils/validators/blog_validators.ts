import { body, param } from 'express-validator';

const createBlogValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),

    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be one of the value, draft or published'),

];

const slugParamValidator = [
    param('slug')
        .notEmpty()
        .withMessage('Slug is required'),
];

const updateSlugValidator = [
    param('blogId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid blog ID'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'),
    body('content'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be one of the value, draft or published'),

];

const blogIdValidator = [
    param('blogId')
        .trim()
        .isMongoId()
        .withMessage('Invalid blog ID'),
];

export {
    createBlogValidator,
    slugParamValidator,
    updateSlugValidator,
    blogIdValidator,
}