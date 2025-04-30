const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middlewares/validation');

// [1] Get All Employees
router.get('/', employeeController.getAllEmployees);

// [2] Get Employee Report (Format soal nomor 4)
router.get('/report', employeeController.getEmployeeReport);

// [3] Get Single Employee
router.get('/:id', employeeController.getEmployeeById);

// [4] Create Employee
router.post('/', validateEmployee, employeeController.createEmployee);

// [5] Update Employee
router.put('/:id', validateEmployee, employeeController.updateEmployee);

// [6] Delete Employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;