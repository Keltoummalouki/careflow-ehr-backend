import app from './src/app.js'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        const port = process.env.PORT || 3001;

        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    } catch (error) {
        console.error(`Failed to start server:` , error);
        process.exit(1);
    }
}

startServer();
