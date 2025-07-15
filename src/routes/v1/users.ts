//* Node modules
import { Router } from 'express';
import { param, query, body } from 'express-validator';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import validationError from '../../middlewares/validationError.ts';
import authorize from '../../middlewares/authorize.ts';

//* Controllers
import getCurrentUser from '../../controllers/v1/user/get_current_user.ts';
import updateCurrentUser from '../../controllers/v1/user/update_current_user.ts';
import deleteCurrentUser from '../../controllers/v1/user/delete_current_user.ts';

//* Models
import User from '../../models/user.ts';
import { updateUserValidator } from '../../utils/authValidators.ts';


export const router = Router();

router.get(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    getCurrentUser,
);

router.put(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    updateUserValidator,
    validationError,
    updateCurrentUser,
);

router.delete(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    deleteCurrentUser,
)
