//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import authorize from '../../middlewares/authorize.ts';
import validationError from '../../middlewares/validationError.ts';

//* Controllers
import createComment from '../../controllers/v1/comment/create_comment.ts';


//* Utils
import { commentValidator } from '../../utils/validators/commentValidator.ts';


export const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    ...commentValidator,
    validationError,
    createComment,
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    // ...likeValidator,
    validationError,
    // unlikeBlog,
);