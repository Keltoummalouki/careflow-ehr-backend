import express from 'express'
import { fileURLToPath } from "url";
import path from 'path';
import morgan from 'morgan';
import logger from './logger/logger.js';

import authRoutes from "./routes/authRoutes.js"
import healthRoutes from './routes/healthRoutes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }))

// current fileName -> full path
const __filename = fileURLToPath(import.meta.url); // import.meta.url: URL of the current module
// current folder -> full path
const __dirname = path.dirname(__filename); // path.dirname: func returns parentDirectory(folder) of a file.

app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

app.get('/', (req, res) => {
  logger.info('Home route accessed');
  res.send('CareFlow EHR running...');
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;