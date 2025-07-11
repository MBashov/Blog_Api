//* Node modules
import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors'

//* Custom modules
import config from './config/index.ts'

//* Express app initial
const app = express();

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

//* Apply cors middleware
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({ message: "Hello world" })
})

app.listen(config.PORT, () => {
    console.log(`erver is listening on http://localhost:${config.PORT}`);
});