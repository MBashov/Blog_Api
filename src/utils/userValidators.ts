//* Node Modules
import { body } from 'express-validator';

//* Models
import User from '../models/user.ts';

const registerValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const existingUser = await User.exists({ email: value });
            if (existingUser) {
                throw new Error('User with this email already exist')
            }
        }),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3 }) //TODO Adjust password requirements
        .withMessage('Password must be at least 3 characters'),

    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
]





export {
    registerValidator
}