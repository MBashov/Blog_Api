import { Types } from "mongoose";

export interface IComment {
    blogId: Types.ObjectId,
    userId: Types.ObjectId,
    content: string,
}

export type CommentData = Pick<IComment, 'content'>;