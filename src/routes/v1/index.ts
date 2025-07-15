//* Node modules
import { Router } from 'express';

//* Custom modules
import { router as authRoutes } from './auth.ts';
import { router as userRoutes } from './users.ts';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);



export { router }
