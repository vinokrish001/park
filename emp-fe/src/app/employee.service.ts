import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Employee {
  id?: number;
  full_name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  start_date: string;
  manager?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  url = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  list(search: string, department: string, page: number, limit: number) {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    if (search) params = params.set('search', search);
    if (department) params = params.set('department', department);
    return this.http.get<{ data: Employee[]; total: number }>(this.url, { params });
  }

  add(emp: Employee) {
    return this.http.post<Employee>(this.url, emp);
  }

  update(id: number, emp: Employee) {
    return this.http.put<Employee>(this.url + '/' + id, emp);
  }

  delete(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
