module.exports = (sequelize, DataTypes) => {
  const EmployeeFamily = sequelize.define('EmployeeFamily', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    identifier: DataTypes.STRING,
    job: DataTypes.STRING,
    place_of_birth: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    relation: DataTypes.ENUM('Suami', 'Istri', 'Anak', 'Ayah', 'Ibu'),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_insured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    relation_status: DataTypes.ENUM('Kandung', 'Angkat'),
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    tableName: 'EmployeeFamilies'
  });

  EmployeeFamily.associate = function(models) {
    EmployeeFamily.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
  };

  return EmployeeFamily;
};
