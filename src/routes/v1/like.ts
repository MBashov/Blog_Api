//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import authorize from '../../middlewares/authorize.ts';
import validationError from '../../middlewares/validationError.ts';

//* Controllers
import likeBlog from '../../controllers/v1/like/like_blog.ts';
import unlikeBlog from '../../controllers/v1/like/unlike_blog.ts';

//* Utils
import { blogIdValidator } from '../../utils/validators/blog_validators.ts';

export const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    ...blogIdValidator,
    validationError,
    likeBlog,
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    ...blogIdValidator,
    validationError,
    unlikeBlog,
);