//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import validationError from '../../middlewares/validationError.ts';
import authorize from '../../middlewares/authorize.ts';

//* Controllers
import createBlog from '../../controllers/v1/blog/create_blog.ts';

export const router = Router();

router.post(
    '/',
    authenticate,
    authorize,
    createBlog,
)