import logger from '../logger/logger.js'

export function errorHandler(err, req, res, next) {
    logger.error(`Error: ${err.message}`, { stack: err.stack })

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            details: Object.values(err.errors).map(e => e.message)
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID format'
        })
    }

    if (err.code === 11000) {
        return res.status(409).json({
            message: 'Duplicate key error',
            field: Object.keys(err.keyPattern)[0]
        })
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        })
    }

    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error'
    })
}