import { BaseModel } from '@/models/base-model';
import type {
  Employee,
  EmployeeCreate,
  EmployeeFilters,
  EmployeeUpdate,
  PaginatedResponse,
} from '@/types/models';

export class EmployeeModel extends BaseModel<Employee> {
  constructor() {
    super('employees');
  }

  // Find all employees excluding soft-delete ones
  async findAllActive(): Promise<Employee[]> {
    return this.db(this.tableName)
      .whereNull('deleted_at')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  // find employee by ID excluding soft-deleted
  async findByIdActive(id: string): Promise<Employee | undefined> {
    return this.db(this.tableName).where({ id }).whereNull('deleted_at').first();
  }

  // create a new employee
  async createEmployee(data: EmployeeCreate): Promise<Employee> {
    const [employee] = await this.db(this.tableName)
      .insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now(),
      })
      .returning('*');

    return employee as Employee;
  }

  // update employee
  async updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee | undefined> {
    const [employee] = await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...data,
        updated_at: this.db.fn.now(),
      })
      .returning('*');

    return employee as Employee | undefined;
  }

  // soft delete
  async softDelete(id: string): Promise<boolean> {
    const updated = await this.db(this.tableName).where({ id }).whereNull('deleted_at').update({
      deleted_at: this.db.fn.now(),
      updated_at: this.db.fn.now(),
    });

    return (updated > 0) as boolean;
  }

  // hard delete
  async hardDelete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();

    return (deleted > 0) as boolean;
  }

  // restore soft-deleted employee
  async restore(id: string): Promise<boolean> {
    const updated = await this.db(this.tableName).where({ id }).whereNotNull('deleted_at').update({
      deleted_at: null,
      updated_at: this.db.fn.now(),
    });

    return (updated > 0) as boolean;
  }

  // search params by name with filters and pagination
  async search(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const { search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = this.db(this.tableName).whereNull('deleted_at');

    // Apply search filters
    if (search) {
      query = query.where('name', 'ILIKE', `%${search}%`);
    }

    // Get total count
    const countResult = await query.clone().count('* as count').first();
    const total = countResult ? parseInt(String(countResult.count), 10) : 0;

    // get paginated data
    const data = await query.select('*').orderBy('created_at', 'desc').limit(limit).offset(offset);

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

  // get employees by designation
  async findByDesignation(designation: string): Promise<Employee[]> {
    return this.db(this.tableName)
      .where({ designation })
      .whereNull('deleted_at')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  // get employee hired within a date range
  async findByHiringDateRange(startDate: string, endDate: string): Promise<Employee[]> {
    return this.db(this.tableName)
      .whereBetween('hiring_date', [startDate, endDate])
      .whereNull('deleted_at')
      .select('*')
      .orderBy('hiring_date', 'desc');
  }

  // get employees by salary range
  async findBySalaryRange(minSalary: number, maxSalary: number): Promise<Employee[]> {
    return this.db(this.tableName)
      .whereBetween('salary', [minSalary, maxSalary])
      .whereNull('deleted_at')
      .select('*')
      .orderBy('salary', 'desc');
  }

  // get employee count by designation
  async countByDesignation(): Promise<{ designation: string; count: number }[]> {
    const rows = await this.db(this.tableName)
      .whereNull('deleted_at')
      .select('designation')
      .count<{ designation: string; count: string }[]>('* as count')
      .groupBy('designation')
      .orderBy('count', 'desc');

    return rows.map((row) => ({
      designation: row.designation,
      count: Number(row.count),
    }));
  }

  // check if employee exists and is active
  async existsActive(id: string): Promise<boolean> {
    const employee = await this.findByIdActive(id);

    return !!employee;
  }

  // update employee photo path
  async updatePhotoPath(id: string, photoPath: string): Promise<Employee | undefined> {
    return this.updateEmployee(id, { photo_path: photoPath });
  }

  // remove photo
  async removePhoto(id: string): Promise<Employee | undefined> {
    return this.updateEmployee(id, { photo_path: null });
  }

  // get all employees with pagination
  async findAllPaginated(page = 1, limit = 10): Promise<PaginatedResponse<Employee>> {
    const offset = (page - 1) * limit;

    const query = this.db(this.tableName).whereNull('deleted_at');

    // get total count
    const countResult = await query.clone().count('* as count').first();

    const total = countResult ? parseInt(String(countResult.count), 10) : 0;

    // get paginated data
    const data = await query.select('*').orderBy('created_at', 'desc').limit(limit).offset(offset);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
