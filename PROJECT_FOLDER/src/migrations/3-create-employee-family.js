module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeFamilies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      identifier: {
        type: Sequelize.STRING
      },
      job: {
        type: Sequelize.STRING
      },
      place_of_birth: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      relation: {
        type: Sequelize.ENUM('Suami', 'Istri', 'Anak', 'Ayah', 'Ibu')
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_insured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      relation_status: {
        type: Sequelize.ENUM('Kandung', 'Angkat')
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('EmployeeFamilies');
  }
};