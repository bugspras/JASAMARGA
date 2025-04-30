module.exports = (sequelize, DataTypes) => {
    const EmployeeFamily = sequelize.define('EmployeeFamily', {
      employee_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      identifier: DataTypes.STRING,
      job: DataTypes.STRING,
      place_of_birth: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      relation: DataTypes.ENUM('Suami', 'Istri', 'Anak', 'Ayah', 'Ibu'),
      is_active: DataTypes.BOOLEAN,
      is_insured: DataTypes.BOOLEAN,
      relation_status: DataTypes.ENUM('Kandung', 'Angkat'),
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING
    }, {});
  
    EmployeeFamily.associate = function(models) {
      EmployeeFamily.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    };
  
    return EmployeeFamily;
  };