//* Custom Modules
import { logger } from '../lib/winston.ts';

//* Models
import User from '../models/user.ts';

//* Types
import type { Response, NextFunction } from 'express';
import type { CustomRequest } from '../types/Request.ts';
import type { IUser } from '../types/users'; 
import type { AuthRole } from '../types/users';


const authorize = (roles: AuthRole[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userId = req.userId;

        try {
            const user: IUser | null = await User.findById(userId).select('role').exec();

            if (!user) {
                res.status(404).json({
                    code: 'NotFound',
                    message: 'User not found',
                });
                return;
            }

            if (!roles.includes(user.role)) {
                res.status(403).json({
                    code: 'AuthorizationError',
                    message: 'Access denied, insufficient permissions',
                });
                return;
            }

            return next();
            
        } catch (err) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal Server Error',
                error: err,
            });
            
            logger.error('Error while authorizing user', err);
        }
    }
};

export default authorize;