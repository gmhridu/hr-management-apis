import { AttendanceController } from '@/controllers/attendance.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { ErrorHandler } from '@/middleware/errors/error.middleware';
import { ValidationMiddleware } from '@/middleware/validate.middleware';
import { AttendanceValidator } from '@/validators/attendance.validator';
import { Router } from 'express';

const router = Router();
const attendanceController = new AttendanceController();

// all attendance routes require authentication
router.use(AuthMiddleware.authenticate());

/**
 * @route get /api/attendance
 * @desc Get all attendance records
 * @access Private
 * @query employee_id, date, from, to, page, limit
 */

router.get(
  '/',
  ValidationMiddleware.validateQuery(AttendanceValidator.query),
  ErrorHandler.asyncHandler(attendanceController.getAllAttendace)
);

/**
 * @route get /api/attendance/employee/:employeeId
 * @desc Get attendance records by employee ID
 * @access Private
 */

router.get(
  '/employee/:employeeId',
  ErrorHandler.asyncHandler(attendanceController.getAttendanceByEmployeeId)
);

/**
 * @route get /api/attendance/date/:date
 * @desc Get attendance records by date
 * @access Private
 */

router.get('/date/:date', ErrorHandler.asyncHandler(attendanceController.getAttendanceByDate));

/**
 * @route get /api/attendance/stats/:employeeId
 * @desc Get attendance statistics for employee
 * @access Private
 * @query start_date, end_date
 */

router.get(
  '/stats/:employeeId',
  ErrorHandler.asyncHandler(attendanceController.getEmployeeStatistics)
);

/**
 * @route get /api/attendance/:id
 * @desc Get attendance record by ID
 * @access Private
 */

router.get(
  '/:id',
  ValidationMiddleware.validateParams(AttendanceValidator.id),
  ErrorHandler.asyncHandler(attendanceController.getAttendanceById)
);

/**
 * @route post /api/attendance
 * @desc Create a new attendance record
 * @access Private
 */

router.post(
  '/',
  ValidationMiddleware.validateBody(AttendanceValidator.create),
  ErrorHandler.asyncHandler(attendanceController.createOrUpdateAttendance)
);

/**
 * @route put /api/attendance/:id
 * @desc Update attendance record by ID
 * @access Private
 */

router.put(
  '/:id',
  ValidationMiddleware.validateParams(AttendanceValidator.id),
  ValidationMiddleware.validateBody(AttendanceValidator.update),
  ErrorHandler.asyncHandler(attendanceController.updateAttendance)
);

/**
 * @route delete /api/attendance/:id
 * @desc Delete attendance record by ID
 * @access Private
 */

router.delete(
  '/:id',
  ValidationMiddleware.validateParams(AttendanceValidator.id),
  ErrorHandler.asyncHandler(attendanceController.deleteAttendance)
);

export const attendanceRoutes = router;
