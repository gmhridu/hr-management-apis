import { EmployeeService } from '@/services/employee.service';
import type { EmployeeCreate, EmployeeFilters, EmployeeUpdate } from '@/types/models';
import { HttpException } from '@/utils/exceptions/common/http.exception';
import type { Request, Response } from 'express';
import status from 'http-status';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  // get all employees
  getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter: EmployeeFilters = {
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await this.employeeService.getAllEmployees(filter);

      res.status(status.OK).json({
        success: true,
        message: 'Employees fetched successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve employees';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get employee by id
  getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee id',
        });
        return;
      }

      const employee = await this.employeeService.getEmployeeById(id);

      res.status(status.OK).json({
        success: true,
        message: 'Employee fetched successfully',
        data: employee,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve employee';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // create employee
  createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const employeeData: EmployeeCreate = {
        name: req.body.name,
        age: req.body.age,
        designation: req.body.designation,
        hiring_date: req.body.hiring_date,
        date_of_birth: req.body.date_of_birth,
        salary: parseFloat(req.body.salary),
      };

      // handle photo upload
      if (req.file) {
        employeeData.photo_path = req.file.path;
      }

      const employee = await this.employeeService.createEmployee(employeeData);

      res.status(status.CREATED).json({
        success: true,
        message: 'Employee created successfully',
        data: employee,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create employee',
      });
    }
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee id',
        });
        return;
      }

      const employeeData: EmployeeUpdate = {};

      if (req.body.name) employeeData.name = req.body.name;

      if (req.body.age) employeeData.age = req.body.age;

      if (req.body.designation) employeeData.designation = req.body.designation;

      if (req.body.hiring_date) employeeData.hiring_date = req.body.hiring_date;

      if (req.body.date_of_birth) employeeData.date_of_birth = req.body.date_of_birth;

      if (req.body.salary) employeeData.salary = parseFloat(req.body.salary);

      if (req.file) {
        const employee = await this.employeeService.updateEmployeePhoto(id, req.file.path);

        res.status(status.OK).json({
          success: true,
          message: 'Employee photo updated successfully',
          data: employee,
        });
        return;
      }

      const employee = await this.employeeService.updateEmployee(id, employeeData);

      res.status(status.OK).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update employee',
      });
    }
  };

  // delete employee
  deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee id',
        });
        return;
      }

      const result = await this.employeeService.deleteEmployee(id);

      if (result) {
        res.status(status.OK).json({
          success: true,
          message: 'Employee deleted successfully',
        });
      } else {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Failed to delete employee',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';

      res.status(status.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // remove employee photo
  removeEmployeePhoto = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee id',
        });
        return;
      }

      const result = await this.employeeService.removeEmployeePhoto(id);

      res.status(status.OK).json({
        success: true,
        message: 'Employee photo removed successfully',
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove employee photo';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get employee by designation
  getEmployeeByDesignation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { designation } = req.params;

      if (typeof designation !== 'string') {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Invalid designation',
        });
        return;
      }

      const employees = await this.employeeService.getEmployeesByDesignation(designation);

      res.status(status.OK).json({
        success: true,
        message: 'Employees fetched successfully',
        data: employees,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch employees by designation';

      res.status(status.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  // get employee count by designation
  getEmployeeCountByDesignation = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.employeeService.getEmployeeCountByDesignation();

      res.status(status.OK).json({
        success: true,
        message: 'Employee count by designation fetched successfully',
        data: stats,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch employee count by designation';

      res.status(status.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };
}
