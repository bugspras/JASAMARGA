const { Sequelize } = require('sequelize');
const config = require('../config/database');
const EmployeeModel = require('./employee');
const EmployeeProfileModel = require('./employeeprofile');
const EducationModel = require('./education');
const EmployeeFamilyModel = require('./employeefamily');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password ? dbConfig.password.toString() : null, // Explicitly convert to string
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions || {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: dbConfig.logging
  }
);

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit with failure
  }
}

testConnection();

const models = {
  Employee: EmployeeModel(sequelize, Sequelize),
  EmployeeProfile: EmployeeProfileModel(sequelize, Sequelize),
  Education: EducationModel(sequelize, Sequelize),
  EmployeeFamily: EmployeeFamilyModel(sequelize, Sequelize)
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;