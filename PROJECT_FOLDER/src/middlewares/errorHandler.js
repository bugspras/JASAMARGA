const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error:', err.stack);
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};