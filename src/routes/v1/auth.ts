//* Node modules
import { Router } from 'express';

//* Controllers
import register from '../../controllers/v1/auth/register.ts';
import login from '../../controllers/v1/auth/login.ts';
import logout from '../../controllers/v1/auth/logout.ts';
import refreshToken from '../../controllers/v1/auth/refresh_token.ts';


//* Middlewares
import validationError from '../../middlewares/validationError.ts';
import authenticate from '../../middlewares/authenticate.ts';

//* Utils
import { loginValidator, registerValidator, tokenValidator } from '../../utils/validators/auth_validators.ts';

export const router = Router();

router.post(
    '/register',
    ...registerValidator,
    validationError,
    register
);

router.post(
    '/login',
    ...loginValidator,
    validationError,
    login
);

router.post(
    '/refresh-token',
    tokenValidator,
    validationError,
    refreshToken
);

router.post(
    '/logout',
    authenticate,
    logout
)