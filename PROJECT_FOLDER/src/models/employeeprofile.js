module.exports = (sequelize, DataTypes) => {
  const EmployeeProfile = sequelize.define('EmployeeProfile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    place_of_birth: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.ENUM('Laki-Laki', 'Perempuan'),
    is_married: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    tableName: 'EmployeeProfiles'
  });

  EmployeeProfile.associate = function(models) {
    EmployeeProfile.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
  };

  return EmployeeProfile;
};
