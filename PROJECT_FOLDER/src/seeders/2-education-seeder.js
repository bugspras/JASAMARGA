module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Educations', [
      {
        employee_id: 1,
        name: 'SMKN 7 Jakarta',
        level: 'SMA',
        description: 'Sekolah Menengah Atas',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date('2022-12-12'),
        updated_at: new Date('2022-12-12')
      },
      {
        employee_id: 2,
        name: 'Universitas Negeri Jakarta',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date('2022-12-12'),
        updated_at: new Date('2022-12-12')
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Educations', null, {});
  }
};