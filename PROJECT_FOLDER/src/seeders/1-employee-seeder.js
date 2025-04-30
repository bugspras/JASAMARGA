module.exports = {
    up: async (queryInterface) => {
      await queryInterface.bulkInsert('Employees', [
        {
          nik: '11012',
          name: 'Budi',
          is_active: true,
          start_date: new Date('2022-12-12'),
          end_date: new Date('2029-12-12'),
          created_by: 'admin',
          updated_by: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          nik: '11013',
          name: 'Jarot',
          is_active: true,
          start_date: new Date('2021-09-01'),
          end_date: new Date('2028-09-01'),
          created_by: 'admin',
          updated_by: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
    },
  
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('Employees', null, {});
    }
  };