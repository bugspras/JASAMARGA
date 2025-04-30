module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE
    },
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    tableName: 'Employees'
  });

  Employee.associate = function(models) {
    Employee.hasOne(models.EmployeeProfile, { foreignKey: 'employee_id', as: 'profile' });
    Employee.hasMany(models.Education, { foreignKey: 'employee_id', as: 'educations' });
    Employee.hasMany(models.EmployeeFamily, { foreignKey: 'employee_id', as: 'families' });
  };

  return Employee;
};
