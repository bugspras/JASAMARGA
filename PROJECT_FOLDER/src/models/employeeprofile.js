module.exports = (sequelize, DataTypes) => {
  const EmployeeProfile = sequelize.define('EmployeeProfile', {
    // your fields here
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  EmployeeProfile.associate = function(models) {
    // your associations here
  };

  return EmployeeProfile;
};