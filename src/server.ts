import express from 'express';
import config from './config/index.ts'
const app = express();

app.listen(config.PORT, () => {
    console.log(`erver is listening on http://localhost:${config.PORT}`);
});