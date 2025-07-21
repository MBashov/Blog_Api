//* Node modules
import { Router } from 'express';
import multer from 'multer';

//* Middlewares
import authenticate from '../../middlewares/authenticate.ts';
import validationError from '../../middlewares/validationError.ts';
import authorize from '../../middlewares/authorize.ts';
import uploadBlogBanner from '../../middlewares/upload_banner_image.ts';

//* Controllers
import createBlog from '../../controllers/v1/blog/create_blog.ts';
import getAllBlogs from '../../controllers/v1/blog/get_all_blogs.ts';
import getBlogsByUser from '../../controllers/v1/blog/get_blogs_by_user.ts';

//* Utils
import { createBlogValidators } from '../../utils/validators/blog_validators.ts';
import { userQueryValidators, userParamValidators } from '../../utils/validators/user_validators.ts';

export const router = Router();

const upload = multer();

router.post(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    upload.single('banner_image'),
    ...createBlogValidators,
    validationError,
    uploadBlogBanner('post'),
    createBlog,
);

router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    ...userQueryValidators,
    validationError,
    getAllBlogs,
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin', 'user']),
    ...userQueryValidators,
    ...userParamValidators,
    validationError,
    getBlogsByUser,
);