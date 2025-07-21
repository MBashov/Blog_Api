//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import authorize from '../../middlewares/authorize.ts';
import validationError from '../../middlewares/validationError.ts';

//* Controllers
import createComment from '../../controllers/v1/comment/create_comment.ts';
import getCommentsByBlog from '../../controllers/v1/comment/get_comments_by_blog.ts';


//* Utils
import { commentValidator } from '../../utils/validators/commentValidator.ts';
import { blogIdValidator } from '../../utils/validators/blog_id-validator.ts';

export const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    ...commentValidator,
    validationError,
    createComment,
);

router.get(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    ...blogIdValidator,
    validationError,
    getCommentsByBlog,
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    //validators
    validationError,
    // unlikeBlog,
);