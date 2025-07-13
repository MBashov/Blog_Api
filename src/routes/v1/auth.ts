import { Router } from 'express';

//* Controllers
import register from '../../controllers/v1/auth/register.ts';
//* Middlewares
//* Models

const authRouter = Router();

authRouter.post('/register', register);

export default authRouter;