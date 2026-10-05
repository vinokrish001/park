export class Employee {
  id?: number;
  full_name: string = '';
  email: string = '';
  role: string = '';
  department: string = '';
  status: string = 'Active';
  start_date: string = '';
  manager?: string | null;
}
