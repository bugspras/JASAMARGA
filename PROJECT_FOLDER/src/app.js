const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/employees', employeeRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;