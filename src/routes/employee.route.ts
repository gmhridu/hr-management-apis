import { EmployeeController } from '@/controllers/employee.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { ErrorHandler } from '@/middleware/errors/error.middleware';
import { uploadMiddleware } from '@/middleware/upload.middleware';
import { ValidationMiddleware } from '@/middleware/validate.middleware';
import { EmployeeValidator } from '@/validators/employee.validator';
import { Router } from 'express';

const router = Router();
const employeeController = new EmployeeController();

// All employee routes require authentication
router.use(AuthMiddleware.authenticate());

/**
 * @route GET /api/employees
 * @desc Get all employees with optional filters and pagination
 * @access Private
 * @query search, page, limit
 */

router.get(
  '/',
  ValidationMiddleware.validateQuery(EmployeeValidator.query),
  ErrorHandler.asyncHandler(employeeController.getAllEmployees)
);

/**
 * @route Get /api/employees/stats/count-by-designation
 * @desc Get employee count by designation
 * @access Private
 */

router.get(
  '/stats/count-by-designation',
  ErrorHandler.asyncHandler(employeeController.getEmployeeCountByDesignation)
);

/**
 * @route Get /api/employees/designation/:designation
 * @desc Get employees by designation
 * @access Private
 */

router.get(
  '/designation/:designation',
  ErrorHandler.asyncHandler(employeeController.getEmployeeByDesignation)
);

/**
 * @route Get /api/employees/:id
 * @desc Get employee by id
 * @access Private
 */

router.get(
  '/:id',
  ValidationMiddleware.validateParams(EmployeeValidator.id),
  ErrorHandler.asyncHandler(employeeController.getEmployeeById)
);

/**
 * @route POST /api/employees
 * @desc Create a new employee
 * @access Private
 * @body name, age, designation, hiring_date, date_of_birth, salary, photo (file)
 */

router.post(
  '/',
  uploadMiddleware.single('photo').single('photo'),
  ValidationMiddleware.validateBody(EmployeeValidator.create),
  ErrorHandler.asyncHandler(employeeController.createEmployee)
);

/**
 * @route Put /api/employees/:id
 * @desc Update employee by id
 * @access Private
 * @body name, age, designation, hiring_date, date_of_birth, salary, photo (file)
 */

router.put(
  '/:id',
  ValidationMiddleware.validateParams(EmployeeValidator.id),
  uploadMiddleware.single('photo').single('photo'),
  ValidationMiddleware.validateBody(EmployeeValidator.update),
  ErrorHandler.asyncHandler(employeeController.updateEmployee)
);

/**
 * @route Delete /api/employees/:id
 * @desc Delete employee by id (soft delete)
 * @access Private
 */
router.delete(
  '/:id',
  ValidationMiddleware.validateParams(EmployeeValidator.id),
  ErrorHandler.asyncHandler(employeeController.deleteEmployee)
);

/**
 * @route Delete /api/employees/:id/photo
 * @desc Delete employee photo by id
 * @access Private
 */

router.delete(
  '/:id/photo',
  ValidationMiddleware.validateParams(EmployeeValidator.id),
  ErrorHandler.asyncHandler(employeeController.removeEmployeePhoto)
);

export const employeeRoutes = router;
