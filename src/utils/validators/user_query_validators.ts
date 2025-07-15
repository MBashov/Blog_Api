import { query } from 'express-validator';

export const userQueryValidators = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50'),

    query('offset')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Offset must be positive number'),
]