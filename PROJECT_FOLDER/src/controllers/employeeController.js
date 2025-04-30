const { Employee, EmployeeProfile, EmployeeFamily, Education } = require('../models');
const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

// Get All Employees with relations
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: EmployeeProfile },
        { model: EmployeeFamily },
        { model: Education }
      ]
    });
    res.status(StatusCodes.OK).json({
      success: true,
      data: employees
    });
  } catch (error) {
    logger.error('Error getting all employees:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get employees'
    });
  }
};

// Get Single Employee with all relations
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: EmployeeProfile },
        { model: EmployeeFamily },
        { model: Education }
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
    logger.error(`Error getting employee with id ${req.params.id}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get employee'
    });
  }
};

// Create Employee with Profile, Family, and Education
exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: errors.array()
    });
  }

  const transaction = await sequelize.transaction();
  try {
    const { profile, families, educations, ...employeeData } = req.body;
    
    // Create Employee
    const employee = await Employee.create(employeeData, { transaction });
    
    // Create Profile if exists
    if (profile) {
      await EmployeeProfile.create({ 
        ...profile, 
        employee_id: employee.id 
      }, { transaction });
    }
    
    // Create Families if exists
    if (families && families.length > 0) {
      await EmployeeFamily.bulkCreate(
        families.map(family => ({ 
          ...family, 
          employee_id: employee.id 
        })),
        { transaction }
      );
    }
    
    // Create Educations if exists
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
        { model: EmployeeProfile },
        { model: EmployeeFamily },
        { model: Education }
      ]
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newEmployee
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating employee:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create employee'
    });
  }
};

// Update Employee with Profile, Family, and Education
exports.updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: errors.array()
    });
  }

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
        { model: EmployeeProfile },
        { model: EmployeeFamily },
        { model: Education }
      ]
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error updating employee with id ${req.params.id}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
};

// Delete Employee
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
    
    // Delete all related records first
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
    
    // Then delete the employee
    await employee.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting employee with id ${req.params.id}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
};

// Generate Employee Report (format seperti soal nomor 4)
exports.getEmployeeReport = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: EmployeeProfile },
        { model: Education },
        { model: EmployeeFamily }
      ]
    });

    const report = employees.map(employee => {
      // Hitung umur
      const age = employee.EmployeeProfile?.date_of_birth 
        ? `${new Date().getFullYear() - new Date(employee.EmployeeProfile.date_of_birth).getFullYear()} Years Old`
        : null;
      
      // Hitung jumlah keluarga
      let familyData = '';
      if (employee.EmployeeFamilies && employee.EmployeeFamilies.length > 0) {
        const spouseCount = employee.EmployeeFamilies.filter(f => 
          ['Suami', 'Istri'].includes(f.relation)
        ).length;
        
        const childCount = employee.EmployeeFamilies.filter(f => 
          f.relation === 'Anak'
        ).length;
        
        familyData = `${spouseCount} spouse & ${childCount} child`;
      }
      
      return {
        employee_id: employee.id,
        nik: employee.nik,
        name: employee.name,
        is_active: employee.is_active,
        gender: employee.EmployeeProfile?.gender || null,
        age: age,
        school_name: employee.Educations[0]?.name || null,
        level: employee.Educations[0]?.level || null,
        family_data: familyData
      };
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating employee report:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate employee report'
    });
  }
};