import express from 'express'
import mongoose from 'mongoose'

const healthRoutes = express.Router();

healthRoutes.get('/health/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    if (dbState === 1) {
      res.status(200).json({
        status: 'success',
        message: 'Database connected',
        state: states[dbState],
        host: mongoose.connection.host,
        database: mongoose.connection.name
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: 'Database not connected',
        state: states[dbState]
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default healthRoutes;