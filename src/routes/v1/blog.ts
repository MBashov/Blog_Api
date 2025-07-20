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

//* Utils
import { createBlogValidators } from '../../utils/validators/blog_validators.ts';

export const router = Router();

const upload = multer();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    ...createBlogValidators,
    validationError,
    uploadBlogBanner('post'),
    createBlog,
)