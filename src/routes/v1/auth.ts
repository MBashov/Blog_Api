//* Node modules
import { Router } from 'express';

//* Controllers
import register from '../../controllers/v1/auth/register.ts';
import login from '../../controllers/v1/auth/login.ts';


//* Middlewares
import validationError from '../../middlewares/validationError.ts';

//* Utils
import { registerValidator } from '../../utils/userValidators.ts';

const authRouter = Router();

authRouter.post('/register', registerValidator, validationError, register);
authRouter.post('/login',  validationError, login);


export default authRouter;