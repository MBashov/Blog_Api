import type { IBlog } from './IBlog';

export type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;