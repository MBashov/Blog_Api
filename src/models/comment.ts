//* Node modules
import { Schema, model } from 'mongoose';

//* Types
import type { IComment } from '../types/IComments.ts';

const commentSchema = new Schema<IComment>({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxLength: [1000, 'Content must be less than 1000 characters']
    }
});

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;