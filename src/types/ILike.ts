import { Types } from "mongoose";

export interface ILike {
    blogId?: Types.ObjectId,
    userId: Types.ObjectId,
    commentId?: Types.ObjectId,
}