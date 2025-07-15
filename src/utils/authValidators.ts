//* Node Modules
import bcrypt from 'bcrypt';
import { body, cookie } from 'express-validator';

//* Models
import { Types } from 'mongoose';
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
            const existingUser: { _id: Types.ObjectId } | null = await User.exists({ email: value }); //TODO: Use type allies for existingUser?
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

const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3 }) //TODO Adjust password requirements
        .withMessage('Password must be at least 3 characters')
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string }
            const user: { password: string } | null = await User.findOne({ email }) //TODO: User type allies for user?
                .select('password')
                .lean()
                .exec();

            if (!user) {
                throw new Error('User email or password is invalid');
            }

            const passwordMatch: boolean = await bcrypt.compare(value, user.password);

            if (!passwordMatch) {
                throw new Error('User email or password is invalid');
            }
        }),
]

const tokenValidator = cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token');

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
    .isLength({max: 100})
    .withMessage('Url must be les than 100 characters'),
]

export {
    registerValidator,
    loginValidator,
    tokenValidator,
    updateUserValidator,
}