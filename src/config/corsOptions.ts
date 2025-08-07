//* Types
import type { CorsOptions } from 'cors';

//* Custom modules
import config from '../config/index.ts'
import { logger } from '../lib/winston.ts';


//* Configure CORS options 
export const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
            callback(new Error(`CORS Error: ${origin} is not allowed by CORS`), false);
        }
    },
    credentials: true,
}