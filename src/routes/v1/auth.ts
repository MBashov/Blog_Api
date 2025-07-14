//* Node modules
import { Router } from 'express';

//* Controllers
import register from '../../controllers/v1/auth/register.ts';
import login from '../../controllers/v1/auth/login.ts';
import refreshToken from '../../controllers/v1/auth/refresh_Token.ts';
import logout from '../../controllers/v1/auth/logout.ts';


//* Middlewares
import validationError from '../../middlewares/validationError.ts';
import authenticate from '../../middlewares/authenticate.ts';

//* Utils
import { loginValidator, registerValidator, tokenValidator } from '../../utils/authValidators.ts';

const authRouter = Router();

authRouter.post('/register', registerValidator, validationError, register);
authRouter.post('/login', loginValidator, validationError, login);
authRouter.post('/refresh-token', tokenValidator, validationError, refreshToken);
authRouter.post('/logout', authenticate, logout)


export default authRouter;