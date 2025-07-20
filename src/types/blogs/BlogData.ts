import type { IBlog } from './index';

export type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;