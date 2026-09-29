import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee, EmployeeService } from '../../employee.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './grid.html',
  styleUrl: './grid.css'
})
export class Grid implements OnInit {
  list: Employee[] = [];
  total = 0;
  page = 1;
  limit = 6;
  search = '';
  department = '';
  showForm = false;
  isEdit = false;
  form: any = {};
  startDate: Date | null = null;

  departments = [
    { label: 'All departments', value: '' },
    { label: 'Product', value: 'Product' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'People', value: 'People' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Customer Care', value: 'Customer Care' }
  ];

  roles = ['Product Designer', 'Engineering Lead', 'People Partner', 'Finance Analyst', 'Account Executive', 'Support Specialist', 'Software Engineer'];
  managers = ['Noah Williams', 'Sofia Chen', 'Liam Brooks', 'Maya Patel', 'Amara Okafor', 'Chris Evans'];
  statuses = ['Active', 'On leave'];

  constructor(
    private api: EmployeeService,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list(this.search, this.department, this.page, this.limit).subscribe({
      next: (res) => {
        this.list = res.data;
        this.total = res.total;
      },
      error: () => this.toast.add({ severity: 'error', summary: 'API not running on port 3000' })
    });
  }

  onSearch() {
    this.page = 1;
    this.load();
  }

  onPage(e: any) {
    this.page = e.page + 1;
    this.limit = e.rows;
    this.load();
  }

  initials(name: string) {
    return (name || '')
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0] || '')
      .join('')
      .toUpperCase();
  }

  openAdd() {
    this.isEdit = false;
    this.form = { full_name: '', email: '', role: '', department: '', status: 'Active', manager: '', start_date: '' };
    this.startDate = null;
    this.showForm = true;
  }

  openEdit(emp: Employee) {
    this.isEdit = true;
    this.form = { ...emp };
    this.startDate = emp.start_date ? new Date(emp.start_date) : null;
    this.showForm = true;
  }

  save() {
    if (!this.form.full_name || !this.form.email || !this.form.role || !this.form.department || !this.startDate) {
      this.toast.add({ severity: 'warn', summary: 'Fill required fields' });
      return;
    }
    const y = this.startDate.getFullYear();
    const m = String(this.startDate.getMonth() + 1).padStart(2, '0');
    const d = String(this.startDate.getDate()).padStart(2, '0');
    this.form.start_date = y + '-' + m + '-' + d;

    const req = this.isEdit && this.form.id
      ? this.api.update(this.form.id, this.form)
      : this.api.add(this.form);

    req.subscribe(() => {
      this.showForm = false;
      this.toast.add({ severity: 'success', summary: this.isEdit ? 'Updated' : 'Added' });
      this.load();
    });
  }

  remove(emp: Employee) {
    this.confirm.confirm({
      message: 'Delete ' + emp.full_name + '?',
      accept: () => {
        this.api.delete(emp.id!).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Deleted' });
          this.load();
        });
      }
    });
  }

  exportCsv() {
    this.api.list(this.search, this.department, 1, 1000).subscribe((res) => {
      const header = 'Name,Email,Role,Department,Status,Start Date,Manager';
      const rows = res.data.map((e) =>
        [e.full_name, e.email, e.role, e.department, e.status, e.start_date, e.manager || ''].join(',')
      );
      const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'employees.csv';
      a.click();
    });
  }
}
