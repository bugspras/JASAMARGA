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
ORDER BY 
  e.id;