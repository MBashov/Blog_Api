//* Custom Modules
import { logger } from "../lib/winston.ts";
import uploadToCloudinary from "../lib/cloudinary.ts";

//* Models
import Blog from "../models/blog.ts";

//* Types
import type { Request, Response, NextFunction } from 'express';
import type { UploadApiErrorResponse } from "cloudinary";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const uploadBlogBanner = (method: 'post' | 'put') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        
        if (method === 'put' && !req.file) {
            next();
            return;
        }

        if (!req.file) {
            res.status(400).json({
                code: 'ValidationError',
                message: 'Blog banner is required',
            });
            return;
        }

        if (req.file.size > MAX_FILE_SIZE) {
            res.status(401).json({
                code: 'ValidationError',
                message: 'File size must be less than 2MB',
            });
            return;
        }

        try {
            // const { blogId } = req.params;
            // const blog = await Blog.findById(blogId).select('banner.publicId').exec();

            const data = await uploadToCloudinary(
                req.file.buffer, 
                // blog?.banner.publicId.replace('blog-api/', ''),
            );

            if (!data) {
                res.status(500).json({
                    code: 'Server Error',
                    message: 'Internal Server Error',
                });

                logger.info('Error while uploading blog banner to cloudinary', {
                    // blogId,
                    // publicId: blog?.banner.publicId,
                });
                return;
            }

            const newBanner = {
                publicId: data.public_id,
                url: data.secure_url,
                width: data.width,
                height: data.height,
            };

            logger.info('Blog banner uploaded to cloudinary', {
                // blogId,
                banner: newBanner,
            });

            req.body.banner = newBanner;

            next();

        } catch (err: UploadApiErrorResponse | any) {
            res.status(err.http_code).json({
                code: err.http_code < 500 ? 'Validation Error' : err.name,
                message: err.message,
            });

            logger.error('Error while uploading blog banner to cloudinary', err);
        }
    }
}

export default uploadBlogBanner;