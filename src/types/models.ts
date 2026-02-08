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
