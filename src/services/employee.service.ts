import { UploadMiddleware } from '@/middleware/upload.middleware';
import { EmployeeModel } from '@/models/employee.model';
import type {
  Employee,
  EmployeeCreate,
  EmployeeFilters,
  EmployeeUpdate,
  PaginatedResponse,
} from '@/types/models';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@/utils/exceptions/exception';
import path from 'path';

export class EmployeeService {
  private employeeModel: EmployeeModel;

  constructor() {
    this.employeeModel = new EmployeeModel();
  }

  // get all employee with optional filters and pagination
  async getAllEmployees(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    if (filters.search) {
      return this.employeeModel.search(filters);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    return this.employeeModel.findAllPaginated(page, limit);
  }

  // get employee by id
  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findByIdActive(id);

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  // create employee
  async createEmployee(data: EmployeeCreate): Promise<Employee> {
    // validate age calculation from date of birth
    const dob = new Date(data.date_of_birth);
    const today = new Date();
    const calculatedAge = Math.floor(
      (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    if (Math.abs(calculatedAge - data.age) > 1) {
      throw new ConflictException('Conflict', 'Age does not match with date of birth provided');
    }

    // validate hiring date is not in the future
    const hiringDate = new Date(data.hiring_date);

    if (hiringDate > today) {
      throw new ConflictException('Conflict', 'Hiring date cannot be in the future');
    }

    return this.employeeModel.createEmployee(data);
  }

  // update employee
  async updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee> {
    // check if employee exists
    const exists = await this.employeeModel.existsActive(id);

    if (!exists) {
      throw new NotFoundException('Employee not found');
    }

    // validate age and date of birth
    if (data.age && data.date_of_birth) {
      const dob = new Date(data.date_of_birth);
      const today = new Date();
      const calculatedAge = Math.floor(
        (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );

      if (Math.abs(calculatedAge - data.age) > 1) {
        throw new ConflictException('Conflict', 'Age does not match with date of birth provided');
      }
    }
    // validate hiring date
    if (data.hiring_date) {
      const hiringDate = new Date(data.hiring_date);
      const today = new Date();

      if (hiringDate > today) {
        throw new ConflictException('Conflict', 'Hiring date cannot be in the future');
      }
    }

    const updated = await this.employeeModel.updateEmployee(id, data);

    if (!updated) {
      throw new NotFoundException('Employee not found');
    }

    return updated;
  }

  // delete employee (soft delete)
  async deleteEmployee(id: string): Promise<boolean> {
    // check if employee exists
    const employee = await this.employeeModel.findByIdActive(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // delete photo file if exists
    if (employee.photo_path) {
      try {
        const uploadPath = process.env.UPLOAD_PATH || './uploads';
        const fullPath = path.join(uploadPath, employee.photo_path);

        if (UploadMiddleware.fileExists(fullPath)) {
          await UploadMiddleware.deleteFile(fullPath);
        }
      } catch (error) {
        throw new InternalServerErrorException('Failed to delete photo file');
      }
    }

    return this.employeeModel.softDelete(id);
  }

  // update employee photo
  async updateEmployeePhoto(id: string, photoPath: string): Promise<Employee> {
    // check if employee exists
    const employee = await this.employeeModel.findByIdActive(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Delete old photo if exists
    if (employee.photo_path) {
      try {
        const uploadPath = process.env.UPLOAD_PATH || './uploads';
        const fullPath = path.join(uploadPath, employee.photo_path);

        if (UploadMiddleware.fileExists(fullPath)) {
          await UploadMiddleware.deleteFile(fullPath);
        }
      } catch (error) {
        throw new InternalServerErrorException('Failed to delete photo file');
      }
    }

    const updated = await this.employeeModel.updateEmployee(id, { photo_path: photoPath });

    if (!updated) {
      throw new NotFoundException('Employee not found');
    }

    return updated;
  }

  // remove employee photo
  async removeEmployeePhoto(id: string): Promise<Employee> {
    // check if employee exists
    const employee = await this.employeeModel.findByIdActive(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.photo_path) {
      throw new NotFoundException('Employee photo not found');
    }

    // delete photo file if exists
    try {
      const uploadPath = process.env.UPLOAD_PATH || './uploads';
      const fullPath = path.join(uploadPath, employee.photo_path);

      if (UploadMiddleware.fileExists(fullPath)) {
        await UploadMiddleware.deleteFile(fullPath);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete photo file');
    }

    const updated = await this.employeeModel.updateEmployee(id, { photo_path: null });

    if (!updated) {
      throw new NotFoundException('Employee not found');
    }

    return updated;
  }

  // get employees by designation
  async getEmployeesByDesignation(designation: string): Promise<Employee[]> {
    return this.employeeModel.findByDesignation(designation);
  }

  // get employees by salary range
  async getEmployeesBySalaryRange(minSalary: number, maxSalary: number): Promise<Employee[]> {
    if (minSalary > maxSalary) {
      throw new BadRequestException('Min salary must be less than max salary');
    }
    return this.employeeModel.findBySalaryRange(minSalary, maxSalary);
  }

  // get employee count by designation
  async getEmployeeCountByDesignation(): Promise<{ designation: string; count: number }[]> {
    return this.employeeModel.countByDesignation();
  }

  // search employee by name, email and dob
  async searchEmployees(
    searchTerm: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Employee>> {
    return this.employeeModel.search({ search: searchTerm, page, limit });
  }
}
