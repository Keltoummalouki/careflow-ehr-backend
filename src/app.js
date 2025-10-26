import express from 'express'
import { fileURLToPath } from "url";
import path from 'path';
import morgan from 'morgan';
import logger from './logger/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

import authRoutes from "./routes/authRoutes.js"
import adminRoutes from './routes/adminRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import patientRoutes from './routes/patientRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js';

import consultationRoutes from './routes/consultationRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import labRoutes from './routes/labRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }))

// // import.meta.url: URL of the current module
// const __filename = fileURLToPath(import.meta.url);
// // current folder -> full path
// const __dirname = path.dirname(__filename); // path.dirname: func returns parentDirectory(folder) of a file.

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
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);  

app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-orders', labRoutes);
app.use('/api/documents', documentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;