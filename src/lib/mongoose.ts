import mongoose from "mongoose";

import config from "../config/index.ts";

import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
    dbName: 'rest-db',
    appName: 'Rest API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * If an error occurs during connection process, it trows an error with descriptive message.
 * 
 * - Uses 'MONGO_URI' as the connection string.
 * - 'clientsOptions' contain additional options for Mongoose.
 * - Errors are properly handled and rethrown for better debugging
 */
export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MongoDB uri is not defined in configuration.');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);

        console.log('Connected to database successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });

    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }

        console.log('Error connecting to database', err);
    }
}

/**
 * Disconnects from the MongoDB database using Mongoose.
 * This function attempts to disconnect from the database asynchronously.
 * If disconnection is successful, a success message is logged.
 * If an error occurs, it is either re-thrown as a new error (if it's an instance of Error) or logged to the console. 
 */
export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();

        console.log('Disconnected from database successfully', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });

    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }

        console.log('Error disconnecting from database', err);
    }
}