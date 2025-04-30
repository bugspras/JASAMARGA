module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('EmployeeProfiles', [
      {
        employee_id: 1,
        place_of_birth: 'Jakarta',
        date_of_birth: new Date('1997-05-02'),
        gender: 'Laki-Laki',
        is_married: true,
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 2,
        place_of_birth: 'Sukabumi',
        date_of_birth: new Date('1996-05-02'),
        gender: 'Laki-Laki',
        is_married: false,
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('EmployeeProfiles', null, {});
  }
};