//* Node modules
import { Router } from 'express';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import authorize from '../../middlewares/authorize.ts';
import validationError from '../../middlewares/validationError.ts';

//* Controllers
import createComment from '../../controllers/v1/comment/create_comment.ts';
import getCommentsByBlog from '../../controllers/v1/comment/get_comments_by_blog.ts';
import getMyComments from '../../controllers/v1/comment/get_my_comments.ts';
import getCommentsByUser from '../../controllers/v1/comment/get_comments_by_user.ts';
import deleteComment from '../../controllers/v1/comment/delete_comment.ts';
import updateComment from '../../controllers/v1/comment/update_comment.ts';

//* Utils
import { commentValidator, commentIdValidator } from '../../utils/validators/comment_validators.ts';
import { blogIdValidator } from '../../utils/validators/blog_validators.ts';
import { userIdValidator } from '../../utils/validators/user_validators.ts';

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
    '/user/current',
    authenticate,
    authorize(['admin', 'user']),
    getMyComments,
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin']),
    ...userIdValidator,
    validationError,
    getCommentsByUser,
);

router.get(
    '/blog/:blogId',
    // authenticate,
    // authorize(['admin', 'user']),
    ...blogIdValidator,
    validationError,
    getCommentsByBlog,
);

router.put(
    '/:commentId',
    authenticate,
    authorize(['admin', 'user']),
    ...commentIdValidator,
    validationError,
    updateComment,
);

router.delete(
    '/:commentId',
    authenticate,
    authorize(['admin', 'user']),
    ...commentIdValidator,
    validationError,
    deleteComment,
);