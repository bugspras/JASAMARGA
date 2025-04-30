const { Employee, EmployeeProfile, EmployeeFamily, Education } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Helper function untuk menghitung umur
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const ageDifMs = Date.now() - new Date(dateOfBirth).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970) + ' Years Old';
};

// [1] Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: EmployeeProfile, as: 'profile' },
        { model: EmployeeFamily, as: 'families' },
        { model: Education, as: 'educations' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: employees
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get employees'
    });
  }
};

// [2] Get Employee Report (Soal Nomor 4)
exports.getEmployeeReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id AS employee_id,
        e.nik,
        e.name,
        e.is_active,
        ep.gender,
        CASE 
          WHEN ep.date_of_birth IS NOT NULL 
          THEN CONCAT(DATE_PART('year', AGE(NOW(), ep.date_of_birth)), ' Years Old') 
          ELSE NULL 
        END AS age,
        ed.name AS school_name,
        ed.level,
        CASE
          WHEN (
            (SELECT COUNT(*) FROM "EmployeeFamilies" ef 
            WHERE ef.employee_id = e.id AND (ef.relation = 'Suami' OR ef.relation = 'Istri')) = 0
            AND
            (SELECT COUNT(*) FROM "EmployeeFamilies" ef 
            WHERE ef.employee_id = e.id AND ef.relation = 'Anak') = 0
          ) THEN '-'
          ELSE CONCAT(
            (SELECT COUNT(*) FROM "EmployeeFamilies" ef 
            WHERE ef.employee_id = e.id AND (ef.relation = 'Suami' OR ef.relation = 'Istri')), 
            ' Istri & ', 
            (SELECT COUNT(*) FROM "EmployeeFamilies" ef 
            WHERE ef.employee_id = e.id AND ef.relation = 'Anak'), 
            ' Anak'
          )
        END AS family_data
      FROM 
        "Employees" e
      LEFT JOIN 
        "EmployeeProfiles" ep ON e.id = ep.employee_id
      LEFT JOIN 
        "Educations" ed ON e.id = ed.employee_id
      WHERE 
        e.id IN (1, 2)
      ORDER BY 
        e.id;
    `;

    const report = await sequelize.query(query, { type: QueryTypes.SELECT });
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate employee report'
    });
  }
};

// [3] Get Single Employee
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: EmployeeProfile, as: 'profile' },
        { model: EmployeeFamily, as: 'families' },
        { model: Education, as: 'educations' }
      ]
    });

    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get employee'
    });
  }
};

// [4] Create Employee with All Relations
exports.createEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { profile, families, educations, ...employeeData } = req.body;
    
    // Create Employee
    const employee = await Employee.create(employeeData, { transaction });
    
    // Create Profile
    if (profile) {
      await EmployeeProfile.create({ 
        ...profile, 
        employee_id: employee.id 
      }, { transaction });
    }
    
    // Create Families
    if (families && families.length > 0) {
      await EmployeeFamily.bulkCreate(
        families.map(family => ({ 
          ...family, 
          employee_id: employee.id 
        })),
        { transaction }
      );
    }
    
    // Create Educations
    if (educations && educations.length > 0) {
      await Education.bulkCreate(
        educations.map(edu => ({ 
          ...edu, 
          employee_id: employee.id 
        })),
        { transaction }
      );
    }
    
    await transaction.commit();
    
    const newEmployee = await Employee.findByPk(employee.id, {
      include: [
        { model: EmployeeProfile, as: 'profile' },
        { model: EmployeeFamily, as: 'families' },
        { model: Education, as: 'educations' }
      ]
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newEmployee
    });
  } catch (error) {
    await transaction.rollback();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create employee'
    });
  }
};

// [5] Update Employee with All Relations
exports.updateEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { profile, families, educations, ...employeeData } = req.body;
    
    // Update Employee
    const employee = await Employee.findByPk(id, { transaction });
    if (!employee) {
      await transaction.rollback();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    await employee.update(employeeData, { transaction });
    
    // Update Profile
    if (profile) {
      const existingProfile = await EmployeeProfile.findOne({ 
        where: { employee_id: id },
        transaction
      });
      
      if (existingProfile) {
        await existingProfile.update(profile, { transaction });
      } else {
        await EmployeeProfile.create({ 
          ...profile, 
          employee_id: id 
        }, { transaction });
      }
    }
    
    // Update Families (delete all then recreate)
    if (families) {
      await EmployeeFamily.destroy({ 
        where: { employee_id: id },
        transaction
      });
      
      if (families.length > 0) {
        await EmployeeFamily.bulkCreate(
          families.map(family => ({ 
            ...family, 
            employee_id: id 
          })),
          { transaction }
        );
      }
    }
    
    // Update Educations (delete all then recreate)
    if (educations) {
      await Education.destroy({ 
        where: { employee_id: id },
        transaction
      });
      
      if (educations.length > 0) {
        await Education.bulkCreate(
          educations.map(edu => ({ 
            ...edu, 
            employee_id: id 
          })),
          { transaction }
        );
      }
    }
    
    await transaction.commit();
    
    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        { model: EmployeeProfile, as: 'profile' },
        { model: EmployeeFamily, as: 'families' },
        { model: Education, as: 'educations' }
      ]
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    await transaction.rollback();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
};

// [6] Delete Employee
exports.deleteEmployee = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const employee = await Employee.findByPk(req.params.id, { transaction });
    
    if (!employee) {
      await transaction.rollback();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Delete all related records
    await EmployeeProfile.destroy({ 
      where: { employee_id: req.params.id },
      transaction
    });
    
    await EmployeeFamily.destroy({ 
      where: { employee_id: req.params.id },
      transaction
    });
    
    await Education.destroy({ 
      where: { employee_id: req.params.id },
      transaction
    });
    
    // Delete the employee
    await employee.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
};