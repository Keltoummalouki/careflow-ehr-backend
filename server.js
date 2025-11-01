import app from './src/app.js'
import dotenv from 'dotenv'
import { initializeBucket } from './src/config/minio.js'
import connectDB from './src/config/db.js'
import logger from './src/logger/logger.js'

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        await initializeBucket()

        const port = process.env.PORT || 5001;

        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    } catch (error) {
        logger.error('Failed to start server:', error)
        console.error(`Failed to start server:` , error);
        process.exit(1);
    }
}

startServer();
