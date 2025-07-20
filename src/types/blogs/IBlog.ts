import { Types } from 'mongoose';

type Banner = {
    publicId: string,
    url: string,
    width: string,
    height: string,
}

export interface IBlog {
    title: string,
    slug: string,
    content: string,
    banner: Banner,
    author: Types.ObjectId,
    viewsCount: number,
    likesCount: number,
    commentsCount: number,
    status: 'draft' | 'published',
}