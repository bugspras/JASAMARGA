const { check, validationResult } = require('express-validator');

exports.validateEmployee = [
  check('nik')
    .notEmpty().withMessage('NIK is required')
    .isLength({ min: 5 }).withMessage('NIK must be at least 5 characters'),
  
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  
  check('is_active')
    .isBoolean().withMessage('is_active must be a boolean'),
  
  check('start_date')
    .notEmpty().withMessage('Start date is required')
    .isDate().withMessage('Invalid date format'),
  
  check('end_date')
    .optional()
    .isDate().withMessage('Invalid date format'),
  
  check('profile')
    .optional()
    .isObject().withMessage('Profile must be an object'),
  
  check('profile.place_of_birth')
    .if(check('profile').exists())
    .notEmpty().withMessage('Place of birth is required'),
  
  check('profile.date_of_birth')
    .if(check('profile').exists())
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Invalid date format'),
  
  check('profile.gender')
    .if(check('profile').exists())
    .notEmpty().withMessage('Gender is required')
    .isIn(['Laki-Laki', 'Perempuan']).withMessage('Invalid gender value'),
  
  check('families')
    .optional()
    .isArray().withMessage('Families must be an array'),
  
  check('families.*.name')
    .if(check('families').exists())
    .notEmpty().withMessage('Family member name is required'),
  
  check('educations')
    .optional()
    .isArray().withMessage('Educations must be an array'),
  
  check('educations.*.name')
    .if(check('educations').exists())
    .notEmpty().withMessage('Education name is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];