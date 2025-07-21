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
import getBlogBySlug from '../../controllers/v1/blog/get_blog_by_slug.ts';
import updateBlog from '../../controllers/v1/blog/update_blog.ts';
import deleteBlog from '../../controllers/v1/blog/delete_blog.ts';

//* Utils
import { createBlogValidator, slugParamValidator, updateSlugValidator } from '../../utils/validators/blog_validators.ts';
import { userQueryValidator, userIdValidator } from '../../utils/validators/user_validators.ts';

export const router = Router();

const upload = multer();

router.post(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    upload.single('banner_image'),
    ...createBlogValidator,
    validationError,
    uploadBlogBanner('post'),
    createBlog,
);

router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    ...userQueryValidator,
    validationError,
    getAllBlogs,
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin', 'user']),
    ...userQueryValidator,
    ...userIdValidator,
    validationError,
    getBlogsByUser,
);

router.get(
    '/:slug',
    authenticate,
    authorize(['admin', 'user']),
    ...slugParamValidator,
    validationError,
    getBlogBySlug,
);

router.put(
    '/:blogId',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    ...updateSlugValidator,
    validationError,
    uploadBlogBanner('put'),
    updateBlog,
);

router.delete(
    '/:blogId',
    authenticate,
    authorize(['admin']),
    deleteBlog,
);