//* Node Modules
import { body, query, param } from 'express-validator';

//* Models
import User from '../../models/user.ts';

const updateUserValidator = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Username must be at least 2 characters')
        .isLength({ max: 20 })
        .withMessage('Username must be less than 20 characters')
        .custom(async (value) => {
            const userExist = await User.findOne({ username: value });

            if (userExist) {
                throw Error('This username is already in use');
            }
        }),

    body('email')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExist = await User.findOne({ email: value });

            if (userExist) {
                throw Error('This email is already in use');
            }
        }),

    body('password')
        .optional()
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters')
        .isLength({ max: 20 })
        .withMessage('First Name must be less than 20 characters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters')
        .isLength({ max: 20 })
        .withMessage('Last Name must be less than 20 characters'),

    body(['website', 'facebook', 'instagram', 'linkedIn', 'x', 'youtube'])
        .optional()
        .trim()
        .isURL()
        .withMessage('Invalid URL address')
        .isLength({ max: 100 })
        .withMessage('Url must be les than 100 characters'),
];

const userQueryValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50'),

    query('offset')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Offset must be positive number'),
];

const userParamValidator = [
    param('userId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid user ID'),
];

export {
    updateUserValidator,
    userQueryValidator,
    userParamValidator,
}