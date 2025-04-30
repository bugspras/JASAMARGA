const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

// Import models
const models = {
  Employee: require('./employee')(sequelize, Sequelize),
  EmployeeProfile: require('./employeeprofile')(sequelize, Sequelize),
  Education: require('./education')(sequelize, Sequelize),
  EmployeeFamily: require('./employeefamily')(sequelize, Sequelize)
};

// Set up model associations
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Export all models and sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize
};
