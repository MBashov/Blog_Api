import { param } from 'express-validator';

export const userParamValidators = [
    param('userId')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid user ID'),
]