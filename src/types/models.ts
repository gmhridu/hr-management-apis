export interface HrUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface HrUserCreate {
  email: string;
  password_hash: string;
  name: string;
}

export interface HrUserResponse {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Employee {
  id: string;
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  salary: number;
  photo_path: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface EmployeeCreate {
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  salary: number;
  photo_path?: string | null;
}

export interface EmployeeUpdate {
  name?: string;
  age?: number;
  designation?: string;
  hiring_date?: Date;
  date_of_birth?: Date;
  salary?: number;
  photo_path?: string | null;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: Date;
  check_in_time: string;
  created_at: Date;
  updated_at: Date;
}

export interface AttendanceCreate {
  employee_id: string;
  date: string;
  check_in_time: string;
}

export interface AttendanceUpdate {
  check_in_time?: string;
}

export interface AttendanceResponse {
  id: number;
  employee_id: string;
  date: string;
  check_in_time: string;
}

export interface AttendanceWithEmployee extends Attendance {
  employee_name: string;
}

export interface MonthlyAttendanceReport {
  employee_id: string;
  name: string;
  days_present: number;
  times_late: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmployeeFilters extends PaginationParams {
  search?: string;
}

export interface AttendanceFilters extends PaginationParams {
  employee_id?: string;
  date?: string;
  from?: string;
  to?: string;
}
