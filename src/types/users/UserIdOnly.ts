import { Types } from "mongoose";

export type UserIdOnly = { _id: Types.ObjectId } | null;