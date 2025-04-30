module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define('Education', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    tableName: 'Educations'
  });

  Education.associate = function(models) {
    Education.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
  };

  return Education;
};
