const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const port = process.env.PORT || 3000;

sequelize.sync({ alter: false })
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info('Database connected!');
    });
  })
  .catch(err => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });