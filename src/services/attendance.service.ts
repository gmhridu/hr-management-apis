import { AttendanceModel } from '@/models/attendance.model';
import { EmployeeModel } from '@/models/employee.model';
import type {
  Attendance,
  AttendanceCreate,
  AttendanceFilters,
  AttendanceUpdate,
  AttendanceWithEmployee,
  MonthlyAttendanceReport,
  PaginatedResponse,
} from '@/types/models';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@/utils/exceptions/exception';

export class AttendanceService {
  private attendanceModel: AttendanceModel;
  private employeeModel: EmployeeModel;

  constructor() {
    this.attendanceModel = new AttendanceModel();

    this.employeeModel = new EmployeeModel();
  }

  // get all attendance records with optional filters and pagination
  async getAllAttendance(
    filters: AttendanceFilters
  ): Promise<PaginatedResponse<AttendanceWithEmployee>> {
    return this.attendanceModel.search(filters);
  }

  // get attendance by ID
  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id);

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  // create or update attendance (upsert)
  async createOrUpdateAttendance(data: AttendanceCreate): Promise<Attendance> {
    // validate employee exists
    const employee = await this.employeeModel.findByIdActive(data.employee_id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // validate date is not in the future
    const attendanceDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    attendanceDate.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Attendance date cannot be in the future');
    }

    // validate check-in time format(HH:MM:SS)
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timePattern.test(data.check_in_time)) {
      throw new BadRequestException('Invalid check-in time format. Use HH:MM:SS');
    }

    // upsert attendance record
    return this.attendanceModel.upsertAttendace(data);
  }

  // update attendance record
  async updateAttendance(id: string, data: AttendanceUpdate): Promise<Attendance> {
    // check if attendance exists
    const exists = await this.attendanceModel.exists(id);

    if (!exists) {
      throw new NotFoundException('Attendance record not found');
    }

    // validate check-in time format(HH:MM:SS)
    if (data.check_in_time) {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timePattern.test(data.check_in_time)) {
        throw new BadRequestException('Invalid check-in time format. Use HH:MM:SS');
      }
    }

    const updated = await this.attendanceModel.updateAttendance(id, data);

    if (!updated) {
      throw new InternalServerErrorException('Failed to update attendance record');
    }

    return updated;
  }

  // delete attendance record
  async deleteAttendance(id: string): Promise<boolean> {
    // check if attendance exists
    const exists = await this.attendanceModel.exists(id);

    if (!exists) {
      throw new NotFoundException('Attendance record not found');
    }

    return this.attendanceModel.delete(id);
  }

  // get attendance records by employee id
  async getAttendanceByEmployeeId(employeeId: string): Promise<Attendance[]> {
    // validate employee exists
    const employee = await this.employeeModel.findByIdActive(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.attendanceModel.findByEmployeeId(employeeId);
  }

  //  get attendance records by date
  async getAttendanceByDate(date: string): Promise<AttendanceWithEmployee[]> {
    // validate date format(YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    return this.attendanceModel.findByDate(date);
  }

  // get attendance record within date range
  async getAttendanceByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
    // Validate date formats
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    // Validate start date is before or equal to end date
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date must be before or equal to end date');
    }

    return this.attendanceModel.findByDateRange(startDate, endDate);
  }

  // get monthly attendance report
  async getMonthlyReport(month: string, employeeId?: string): Promise<MonthlyAttendanceReport[]> {
    // Validate month format (YYYY-MM)
    const monthPattern = /^\d{4}-\d{2}$/;
    if (!monthPattern.test(month)) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    // Validate employee exists if provided
    if (employeeId) {
      const employee = await this.employeeModel.findByIdActive(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
    }

    return this.attendanceModel.getMonthlyReport(month, employeeId!);
  }

  // get attendance statistics for employee
  async getEmployeeStatistics(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    total_days: number;
    late_days: number;
    on_time_days: number;
    late_percentage: number;
  }> {
    // validate employee exists
    const employee = await this.employeeModel.findByIdActive(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // validate date formats if provided
    if (startDate && endDate) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }

      if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Start date must be before or equal to end date');
      }
    }
    return this.attendanceModel.getEmployeeStatistics(employeeId, startDate, endDate);
  }

  // check if attendace exists for employee on specific date
  async checkAttendanceExists(employeeId: string, date: string): Promise<boolean> {
    return this.attendanceModel.existsForEmployeeOnDate(employeeId, date);
  }

  // get late arrivals count for employee in date range
  async gateLateArrivalsCount(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    // Validate employee exists
    const employee = await this.employeeModel.findByIdActive(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Validate date formats
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date must be before or equal to end date');
    }

    return this.attendanceModel.countLateArrivalsByEmployeeAndDateRange(
      employeeId,
      startDate,
      endDate
    );
  }

  // bluk create attendance records
  async blukCreateAttendance(records: AttendanceCreate[]): Promise<Attendance[]> {
    const results: Attendance[] = [];

    for (const record of records) {
      try {
        const attendance = await this.createOrUpdateAttendance(record);
        results.push(attendance);
      } catch (error) {
        throw new BadRequestException(
          `Failed to create attendance for employee ${record.employee_id}:`,
          error
        );
      }
    }

    return results;
  }
}
