//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import validationError from '../../middlewares/validationError.ts';
import authorize from '../../middlewares/authorize.ts';

//* Controllers
import getCurrentUser from '../../controllers/v1/user/get_current_user.ts';
import updateCurrentUser from '../../controllers/v1/user/update_current_user.ts';
import deleteCurrentUser from '../../controllers/v1/user/delete_current_user.ts';
import getAllUsers from '../../controllers/v1/user/get_all_users.ts';
import getUser from '../../controllers/v1/user/get_user.ts';
import deleteUser from '../../controllers/v1/user/delete_user.ts';

//* Utils
import { userQueryValidator, userIdValidator, updateUserValidator } from '../../utils/validators/user_validators.ts';


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
    ...updateUserValidator,
    validationError,
    updateCurrentUser,
);

router.delete(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    deleteCurrentUser,
);

router.get(
    '/',
    authenticate,
    authorize(['admin']),
    ...userQueryValidator,
    validationError,
    getAllUsers,
);

router.get(
    '/:userId',
    authenticate,
    authorize(['admin']),
    ...userIdValidator,
    validationError,
    getUser,
);

router.delete(
    '/:userId',
    authenticate,
    authorize(['admin']),
    ...userIdValidator,
    validationError,
    deleteUser,
)