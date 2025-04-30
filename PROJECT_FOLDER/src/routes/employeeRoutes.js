const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middlewares/validation');

// Get All Employees
router.get('/', employeeController.getAllEmployees);

// Get Employee Report (format seperti soal nomor 4)
router.get('/report', employeeController.getEmployeeReport);

// Get Single Employee
router.get('/:id', employeeController.getEmployeeById);

// Create Employee
router.post('/', validateEmployee, employeeController.createEmployee);

// Update Employee
router.put('/:id', validateEmployee, employeeController.updateEmployee);

// Delete Employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;