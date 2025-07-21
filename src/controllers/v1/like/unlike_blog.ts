//* Custom Modules
import { logger } from '../../../lib/winston.ts';

//* Models
import Blog from '../../../models/blog.ts';
import Like from '../../../models/like.ts';

//* Types
import type { Response } from 'express';
import type { CustomRequest } from '../../../types/Request.ts';

const unlikeBlog = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const blogId = req.params.blogId;

  try {
    const deleteResult = await Like.deleteOne({ blogId, userId });
    console.log(deleteResult);
    
    if (deleteResult.deletedCount === 0) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Like not found',
      });
      return;
    }

    const blog = await Blog.findById(blogId).select('likesCount').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    blog.likesCount = Math.max(0, blog.likesCount - 1); // Prevent negative count
    await blog.save();

    logger.info('Blog disliked successfully', {
      userId,
      blogId,
      likesCount: blog.likesCount,
    });

    res.status(200).json({
      likesCount: blog.likesCount,
    });

  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });

    logger.error('Error while disliking a blog', err);
  }
};

export default unlikeBlog;