const { check, validationResult } = require('express-validator');

exports.validateEmployee = [
  // Employee validation
  check('nik').notEmpty().withMessage('NIK is required'),
  check('name').notEmpty().withMessage('Name is required'),
  check('is_active').isBoolean().withMessage('is_active must be boolean'),
  check('start_date').isDate().withMessage('Invalid start date'),
  
  // Profile validation
  check('profile.place_of_birth').if(check('profile').exists()).notEmpty(),
  check('profile.date_of_birth').if(check('profile').exists()).isDate(),
  check('profile.gender').if(check('profile').exists()).isIn(['Laki-Laki', 'Perempuan']),
  
  // Families validation
  check('families.*.name').if(check('families').exists()).notEmpty(),
  check('families.*.relation').if(check('families').exists()).isIn(['Suami', 'Istri', 'Anak', 'Ayah', 'Ibu']),
  
  // Education validation
  check('educations.*.name').if(check('educations').exists()).notEmpty(),
  check('educations.*.level').if(check('educations').exists()).notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];