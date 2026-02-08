import { BaseModel } from '@/models/base-model';
import type {
  Attendance,
  AttendanceCreate,
  AttendanceFilters,
  AttendanceUpdate,
  AttendanceWithEmployee,
  MonthlyAttendanceReport,
  PaginatedResponse,
} from '@/types/models';

export class AttendanceModel extends BaseModel<Attendance> {
  constructor() {
    super('attendance');
  }

  // create or update attendance (upsert)
  async upsertAttendace(data: AttendanceCreate): Promise<Attendance> {
    const { employee_id, date, check_in_time } = data;

    // check if attendance already exists
    const existing = await this.db(this.tableName).where({ employee_id, date }).first();

    if (existing) {
      // update existing record
      const [updated] = await this.db(this.tableName)
        .where({
          employee_id,
          date,
        })
        .update({
          check_in_time,
          // updated_at: this.db.fn.now(),
        })
        .returning('*');

      return updated;
    } else {
      // create new record
      const [created] = await this.db(this.tableName)
        .insert({
          employee_id,
          date,
          check_in_time,
          // created_at: this.db.fn.now(),
          // updated_at: this.db.fn.now(),
        })
        .returning('*');

      return created;
    }
  }

  // create attendance record
  async createAttendance(data: AttendanceCreate): Promise<Attendance> {
    const [attendance] = await this.db(this.tableName).insert(data).returning('*');

    return attendance;
  }

  // update attendance record
  async updateAttendance(id: string, data: AttendanceUpdate): Promise<Attendance | undefined> {
    const [attendance] = await this.db(this.tableName)
      .where({ id })
      .update({
        ...data,
        // updated_at: this.db.fn.now(),
      })
      .returning('*');

    return attendance;
  }

  // Find attendance records by employee ID
  async findByEmployeeId(employeeId: string): Promise<Attendance[]> {
    return this.db(this.tableName)
      .where({ employee_id: employeeId })
      .select('*')
      .orderBy('date', 'desc');
  }

  // find attendance by employee and delete
  async findByEmployeeAndDate(employeeId: string, date: string): Promise<Attendance | undefined> {
    return this.db(this.tableName).where({ employee_id: employeeId, date }).first();
  }

  // find attendance records by date
  async findByDate(date: string): Promise<AttendanceWithEmployee[]> {
    return this.db(this.tableName)
      .join('employees', 'attendance.employee_id', 'employees.id')
      .where('attendance.date', date)
      .whereNull('employees.deleted_at')
      .select('attendance.*', 'employees.name as employee_name');
  }

  // find attendance records within date range
  async findByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
    return this.db(this.tableName)
      .whereBetween('date', [startDate, endDate])
      .select('*')
      .orderBy('date', 'asc')
      .orderBy('employee_id', 'asc');
  }

  // find attendance with filters and pagination
  async search(filters: AttendanceFilters): Promise<PaginatedResponse<AttendanceWithEmployee>> {
    const { employee_id, date, from, to, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = this.db(this.tableName)
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at');

    // apply filters
    if (employee_id) {
      query = query.where('attendance.employee_id', employee_id);
    }
    if (date) {
      query = query.where('attendance.date', date);
    }

    if (from && to) {
      query = query.whereBetween('attendance.date', [from, to]);
    } else if (from) {
      query = query.where('attendance.date', '>=', from);
    } else if (to) {
      query = query.where('attendance.date', '<=', to);
    }

    // get total count
    const countResult = await query.clone().count('* as count').first();
    const total = countResult ? parseInt(String(countResult.count), 10) : 0;

    // get paginated results
    const data = await query
      .select('attendance.*', 'employees.name as employee_name')
      .orderBy('attendance.date', 'desc')
      .orderBy('attendance.employee_id', 'asc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // get monthly attendance report
  async getMonthlyReport(month: string, employeeId?: string): Promise<MonthlyAttendanceReport[]> {
    const [yearStr, monthStr] = month.split('-');
    const year = Number(yearStr);
    const monthNum = Number(monthStr);

    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0); // last day of month

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    let query = this.db(this.tableName)
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereRaw('DATE(attendance.date) BETWEEN ? AND ?', [startDate, endDate])
      .whereNull('employees.deleted_at');

    if (employeeId) {
      query = query.where('attendance.employee_id', employeeId);
    }

    const results = await query
      .select(
        'attendance.employee_id',
        'employees.name as employee_name',
        this.db.raw('COUNT(DISTINCT DATE(attendance.date)) as days_present'),
        this.db.raw(`
        SUM(
          CASE
            WHEN attendance.check_in_time > '09:45:00' THEN 1
            ELSE 0
          END
        ) as times_late
      `)
      )
      .groupBy('attendance.employee_id', 'employees.name')
      .orderBy('employees.name', 'asc');

    return results.map((row: any) => ({
      employee_id: row.employee_id,
      name: row.employee_name,
      days_present: Number(row.days_present),
      times_late: Number(row.times_late),
    }));
  }

  // get attendance count for employee in date range
  async countByEmployeeAndDateRange(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const result = await this.db(this.tableName)
      .where({ employee_id: employeeId })
      .whereBetween('date', [startDate, endDate])
      .count('* as count')
      .first();

    return result ? parseInt(String(result.count), 10) : 0;
  }

  // get late arrivals for employee in date range
  async countLateArrivalsByEmployeeAndDateRange(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const result = await this.db(this.tableName)
      .where({ employee_id: employeeId })
      .whereBetween('date', [startDate, endDate])
      .where('check_in_time', '>', '09:45:00')
      .count('* as count')
      .first();

    return result ? parseInt(String(result.count), 10) : 0;
  }

  // check if attendance exists for employee on date
  async existsForEmployeeOnDate(employeeId: string, date: string): Promise<boolean> {
    const attendance = await this.findByEmployeeAndDate(employeeId, date);

    return !!attendance;
  }

  // get all attendance records with pagination
  async findAllPaginated(page = 1, limit = 10): Promise<PaginatedResponse<AttendanceWithEmployee>> {
    const offset = (page - 1) * limit;

    const query = this.db(this.tableName)
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at');

    // get total count
    const countResult = await query.clone().count('* as count').first();
    const total = countResult ? parseInt(String(countResult.count), 10) : 0;

    // get paginated data
    const data = await query
      .select('attendance.*', 'employees.name as employee_name')
      .orderBy('attendance.date', 'desc')
      .orderBy('attendance.employee_id', 'asc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // delete attendance records for employees
  async deleteByEmployeeId(employeeId: string): Promise<number> {
    return this.db(this.tableName).where({ employee_id: employeeId }).delete();
  }

  // get attendance statistics for employee
  async getEmployeeStatistics(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total_days: number;
    late_days: number;
    on_time_days: number;
    late_percentage: number;
  }> {
    let query = this.db(this.tableName).where({ employee_id: employeeId });

    if (startDate && endDate) {
      query = query.whereBetween('date', [startDate, endDate]);
    }

    const results = await query
      .select(
        this.db.raw('COUNT(*) as total_days'),
        this.db.raw("SUM(CASE WHEN check_in_time > '09:45:00' THEN 1 ELSE 0 END) as late_days"),
        this.db.raw("SUM(CASE WHEN check_in_time <= '09:45:00' THEN 1 ELSE 0 END) as on_time_days")
      )
      .first();

    const totalDays = results ? parseInt(String(results.total_days), 10) : 0;
    const lateDays = results ? parseInt(String(results.late_days), 10) : 0;
    const onTimeDays = results ? parseInt(String(results.on_time_days), 10) : 0;
    const latePercentage = totalDays > 0 ? (lateDays / totalDays) * 100 : 0;

    return {
      total_days: totalDays,
      late_days: lateDays,
      on_time_days: onTimeDays,
      late_percentage: parseFloat(latePercentage.toFixed(2)),
    };
  }
}
