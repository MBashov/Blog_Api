//* Node modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

//* Custom modules
import config from './config/index.ts'
import limiter from './lib/express_rate_limit.ts';
import { router as v1Routes } from './routes/v1/index.ts';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose.ts';
import { logger } from './lib/winston.ts';
import { corsOptions } from './config/corsOptions.ts';


//* Express app initial
const app = express();

//* Apply CORS middleware
app.use(cors(corsOptions));

//* Enable JSON request body parsing 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 1024 })); // Only compress responses larger than 1 KB
app.use(helmet()); // Use helmet to enhance security by setting various HTTP headers
app.use(limiter); // Apply rate limiting middleware to prevent excessive requests enhance security


(async () => {
    try {
        await connectToDatabase();

        app.use('/api/v1', v1Routes);

        app.listen(config.PORT, () => {
            logger.info(`Server is listening on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start the server', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message is disconnection is successful
 * - If an error occurs during disconnection, it is a logged to console. 
 * - Exits the process with status code `0` (indicating a successful shutdown)
 */
const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        logger.warn('Server SHUTDOWN');
        process.exit(0);
    } catch (err) {
        logger.error('Error during server shutdown', err);
    }
}

/**
 * Listening for termination signals ('SIGTERM' and 'SIGINT').
 * 
 * - 'SIGTERM' is typically sent when a stopping a process (e.g., 'kill' command or container shutdown).
 * - 'SIGINT' is triggered when the user interrupts the process (e.g., pressing 'Ctr + C').
 * - When either signal is received, 'handleServerShutdown is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);

