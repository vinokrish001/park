export class CreateEmployeeDto {
  full_name: string = '';
  email: string = '';
  role: string = '';
  department: string = '';
  status?: string;
  start_date: string = '';
  manager?: string | null;
}
