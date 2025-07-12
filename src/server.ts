//* Node modules
import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

//* Custom modules
import config from './config/index.ts'
import limiter from './lib/express_rate_limit.ts';
import {router as v1Routes} from './routes/v1/index.ts';

//* Express app initial
const app = express();
//! TODO: Export corsOptions to another file
//* Configure CORS options 
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS Error: ${origin} is not allowed by CORS`);
            callback(new Error(`CORS Error: ${origin} is not allowed by CORS`), false);
        }
    },
}

//* Apply CORS middleware
app.use(cors(corsOptions));

//* Enable JSON request body parsing 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 1024 })); // Only compress responses larger than 1 KB
app.use(helmet()); // Use helmet to enhace security by setting various HTTP headers
app.use(limiter); // Apply rate limitting middleware to prevent excessive requests enhance security


(async () => {
    try {
        app.use('/api/v1', v1Routes);

        app.listen(config.PORT, () => {
            console.log(`Server is listening on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.log('Failled to start the server', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();