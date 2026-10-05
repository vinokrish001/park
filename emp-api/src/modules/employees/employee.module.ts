import { Express } from 'express';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

export function registerEmployeeModule(app: Express) {
  const service = new EmployeeService();
  const controller = new EmployeeController(service);
  app.use('/api/employees', controller.router);
}
