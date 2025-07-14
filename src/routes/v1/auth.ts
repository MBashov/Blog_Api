//* Node modules
import { Router } from 'express';

//* Controllers
import register from '../../controllers/v1/auth/register.ts';
import login from '../../controllers/v1/auth/login.ts';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);


export default authRouter;