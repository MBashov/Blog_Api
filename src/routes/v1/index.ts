//* Node modules
import { Router } from 'express';

//* Custom modules
import authRouter from './auth.ts';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRouter);



export { router }
