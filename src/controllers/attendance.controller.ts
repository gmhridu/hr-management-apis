import { AttendanceService } from '@/services/attendance.service';
import type { AttendanceCreate, AttendanceFilters, AttendanceUpdate } from '@/types/models';
import type { NextFunction, Request, Response } from 'express';
import status from 'http-status';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  // get all attendance records with optional filters
  getAllAttendace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: AttendanceFilters = {
        employee_id: req.query.employee_id as string,
        date: req.query.date as string,
        from: req.query.from as string,
        to: req.query.to as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await this.attendanceService.getAllAttendance(filters);

      res.status(status.OK).json({
        success: true,
        message: 'Attendance records fetched successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve attendance records';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get attendance by id
  getAttendanceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendanceId = req.params.id;

      if (typeof attendanceId !== 'string') {
        return res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid attendance ID',
        });
      }

      const attendance = await this.attendanceService.getAttendanceById(attendanceId);

      if (!attendance) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: 'Attendance record not found',
        });
      }

      res.status(status.OK).json({
        success: true,
        message: 'Attendance record fetched successfully',
        data: attendance,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve attendance record';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // create or update attendance record
  createOrUpdateAttendance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const attendanceData: AttendanceCreate = {
        employee_id: req.body.employee_id,
        date: req.body.date,
        check_in_time: req.body.check_in_time,
      };

      const attendance = await this.attendanceService.createOrUpdateAttendance(attendanceData);

      res.status(status.CREATED).json({
        success: true,
        message: 'Attendance record created or updated successfully',
        data: attendance,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create or update attendance record';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });

      next(error);
    }
  };

  // update attendance record
  updateAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid attendance ID',
        });
        return;
      }

      const attendanceData: AttendanceUpdate = {
        check_in_time: req.body.check_in_time,
      };

      const attendance = await this.attendanceService.updateAttendance(id, attendanceData);

      res.status(status.OK).json({
        success: true,
        message: 'Attendance record updated successfully',
        data: attendance,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update attendance record';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // delete attendance record
  deleteAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid attendance ID',
        });
        return;
      }

      const result = await this.attendanceService.deleteAttendance(id);

      if (result) {
        res.status(status.OK).json({
          success: true,
          message: 'Attendance record deleted successfully',
        });
      } else {
        res.status(status.NOT_FOUND).json({
          success: false,
          message: 'Failed to delete attendance record',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete attendance record';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get attendance records by employee ID
  getAttendanceByEmployeeId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { employeeId } = req.params;

      if (typeof employeeId !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      const attendanceRecords = await this.attendanceService.getAttendanceByEmployeeId(employeeId);

      res.status(status.OK).json({
        success: true,
        message: 'Attendance records retrieved successfully',
        data: attendanceRecords,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve attendance records';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get Attendance By Date
  getAttendanceByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date } = req.params;

      if (typeof date !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD',
        });
        return;
      }

      const attendance = await this.attendanceService.getAttendanceByDate(date);

      res.status(status.OK).json({
        success: true,
        message: 'Attendance records retrieved successfully',
        data: attendance,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve attendance records';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // Get monthly attendance report
  getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const month = req.query.month as string;
      const employeeId = req.query.employee_id as string;

      if (!month) {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Month parameter is required (format: YYYY-MM)',
        });
      }

      const report = await this.attendanceService.getMonthlyReport(month, employeeId);

      res.status(status.OK).json({
        success: true,
        message: 'Monthly attendance report retrieved successfully',
        data: report,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve monthly report';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // Get attendance statistics for employee
  getEmployeeStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const employeeId = req.params.employeeId as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const statistics = await this.attendanceService.getEmployeeStatistics(
        employeeId,
        startDate,
        endDate
      );

      res.status(status.OK).json({
        success: true,
        message: 'Employee attendance statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve employee statistics';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };
}
