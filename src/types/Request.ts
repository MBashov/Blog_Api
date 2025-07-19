import type { Request } from "express";
import { Types } from "mongoose";

export interface CustomRequest extends Request {
    userId?: Types.ObjectId;
}