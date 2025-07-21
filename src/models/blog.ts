//* Node modules
import { Schema, model } from 'mongoose';

//* Types
import type { IBlog } from '../types/blogs';

//* Utils
import { genSlug } from '../utils/gen_unique_name.ts';

const BlogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            minlength: [3, 'Title must be at least 3 characters'],
            maxLength: [180, 'Title must be at most 180 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: [true, 'Slug must be unique'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        banner: {
            publicId: {
                type: String,
                required: [true, 'Banner public id is required'],
            },
            url: {
                type: String,
                required: [true, 'Banner url is required'],
            },

            width: {
                type: Number,
                required: [true, 'Banner width is required'],
            },

            height: {
                type: Number,
                required: [true, 'Banner height is required'],
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required']
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: {
                values: ['draft', 'published'],
                message: '{VALUE} is not supported',
            },
            default: 'draft',
        },
    },
    {
        timestamps: {
            createdAt: 'publishedAt',
        }
    }
);

BlogSchema.pre('validate', function(next) {
    if (this.title && !this.slug) {
        this.slug = genSlug(this.title);
    }
    
    next();
});

const Blog = model<IBlog>('Blog', BlogSchema);

export default Blog;