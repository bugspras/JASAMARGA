module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
      employee_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      level: DataTypes.STRING,
      description: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING
    }, {});
  
    Education.associate = function(models) {
      Education.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    };
  
    return Education;
  };