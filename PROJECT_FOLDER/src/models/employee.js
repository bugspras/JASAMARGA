module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    // your fields here
  }, {
    underscored: true,  // This converts createdAt to created_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Employee.associate = function(models) {
    // your associations here
  };

  return Employee;
};