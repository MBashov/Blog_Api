//* Node modules
import { Schema, model } from 'mongoose';

//* Types
import type { ILike } from '../types/ILike.ts';

const likeSchema = new Schema<ILike>({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Like = model<ILike>('Like', likeSchema);

export default Like;
