module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('EmployeeFamilies', [
      {
        employee_id: 1,
        name: 'Jara',
        identifier: '2010MBA9999000',
        job: 'PNS',
        place_of_birth: 'Depok',
        date_of_birth: new Date('1999-10-17'),
        relation: 'Istri',
        is_active: true,
        is_insured: false,
        relation_status: 'Kandung',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date('2020-10-19'),
        updated_at: new Date('2020-10-19')
      },
      {
        employee_id: 1,
        name: 'Budi Jr',
        identifier: '2020MBA9999001',
        job: 'Pelajar',
        place_of_birth: 'Jakarta',
        date_of_birth: new Date('2015-05-20'),
        relation: 'Anak',
        is_active: true,
        is_insured: true,
        relation_status: 'Kandung',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: new Date('2020-10-19'),
        updated_at: new Date('2020-10-19')
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('EmployeeFamilies', null, {});
  }
};