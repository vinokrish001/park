# Employee Management — type this on client laptop

Use **Angular 17 + CLI**. Generate files with `ng`. Then type the code into those files.

Run API on **3000**. Run UI on **4200**.

---

# Project explanation (for your understanding + demo)

MERN is Mongo + Express + React + Node.  
This is the same idea, but **Angular** instead of React, and **Postgres** instead of Mongo.

```
Browser (Angular 17 + PrimeNG)
        HTTP  http://localhost:4200
              ↓
Node Express API  http://localhost:3000/api/employees
              ↓
PostgreSQL  (you see tables in DBeaver)
```

**emp-fe** = UI (like React frontend)  
**emp-api** = REST API (like Express backend)  
**Postgres** = database (like Mongo, but tables/rows)

## What the app does

Employees page:

- list employees in a table (6 per page)
- search by name, email, or role
- filter by department
- add employee (dialog)
- edit employee (dialog)
- delete employee (confirm)

Sidebar Dashboard/Leave/Reports are only layout. Real work is Employees.

## Backend — how to explain `server.js`

Think of it like an Express + Mongoose app, but SQL with `pg`.

| Piece | Meaning |
| --- | --- |
| `express` | same as MERN |
| `cors` | Angular 4200 can call API 3000 |
| `dotenv` | read `.env` (DB password not in code) |
| `Pool` | connection to Postgres (like mongoose.connect) |
| `app.use(express.json())` | parse JSON body |

**SQL vs Mongo:** `pool.query('SELECT ...', [values])` is like `Model.find()`. `$1 $2` are parameters (safe, not string concat for user input).

`cols` uses `to_char(start_date, 'YYYY-MM-DD')` so the date stays `2024-01-12`. If you send a JS Date as JSON it can shift one day (timezone).

### APIs (CRUD)

Same as a MERN employee API:

| Method | URL | What |
| --- | --- | --- |
| GET | `/api/employees?search=&department=&page=1&limit=6` | list + search + filter + pagination |
| GET | `/api/employees/:id` | one row |
| POST | `/api/employees` | add |
| PUT | `/api/employees/:id` | update |
| DELETE | `/api/employees/:id` | delete |

**GET list logic (say this in review):**

1. Read `search`, `department`, `page`, `limit` from query
2. Build `WHERE` only if search/department is filled
3. `COUNT(*)` → total rows (paginator needs this)
4. `SELECT` with `LIMIT` + `OFFSET` → current page
5. Return `{ data, total, page, limit }`

Search: `ILIKE '%text%'` on name, email, role (case insensitive).

**schema.sql:** `SERIAL` = auto id (like Mongo ObjectId but number). `UNIQUE` on email. Sample INSERTs so the table is not empty.

**DBeaver:** GUI for Postgres (like Mongo Compass). You create DB `emp_manage` and run the SQL.

## Frontend — how to explain Angular (React mapping)

| React | Angular 17 |
| --- | --- |
| `App.jsx` | `app.component.ts` + `app.html` |
| React Router | `app.routes.ts` |
| `axios` / fetch | `HttpClient` in `employee.service.ts` |
| `useState` | class fields (`list`, `page`, `showForm`) |
| `useEffect` | `ngOnInit()` |
| components folder | `ng g c components/grid` |

**Standalone component** = the component imports what it needs (`TableModule`, `FormsModule`). No big `app.module.ts`.

**PrimeNG** = UI kit (like MUI / Ant Design). `p-table`, `p-dialog`, `p-dropdown`, `p-calendar`, `p-button`.

### File roles

**`app` layout**  
Blue sidebar + top bar + `<router-outlet>`. Outlet is where the route component renders (like `{children}` / `<Outlet />`).

**`app.routes.ts`**  
`''` → redirect to `employees`.  
`employees` → `Grid` component.

**`app.config.ts`**  
App-wide providers:

- `provideHttpClient()` — API calls
- `provideRouter()` — routes
- `provideAnimations()` — PrimeNG dialogs
- `ConfirmationService` / `MessageService` — delete confirm + toast

**`employee.service.ts`**  
Only HTTP. Like an `api.js` in MERN. `@Injectable({ providedIn: 'root' })` = one shared service (like a singleton).

**`grid.ts`**  
Page logic:

- `load()` → GET list
- `onSearch()` → reset page to 1, load again
- `onPage()` → PrimeNG page is 0-based, we send `page + 1` to API
- `openAdd` / `openEdit` → open dialog
- `save()` → POST or PUT, date formatted `YYYY-MM-DD`
- `remove()` → confirm then DELETE
- `initials()` → "Maya Patel" → "MP"

**`grid.html`**  
Template (like JSX). `[(ngModel)]` is two-way binding (like value + onChange).  
`*ngIf` / `[class.leave]` = conditional UI.  
`p-table` `[lazy]="true"` = we fetch from API on page change, not all rows in browser.

**`grid.css` / `app.css`**  
Layout and table look (sidebar blue, status pills).

## One request flow (say this)

User types in search → `onSearch()` → `EmployeeService.list()` →  
`GET /api/employees?search=maya&page=1&limit=6` →  
Postgres `WHERE full_name ILIKE '%maya%'` →  
JSON `{ data, total }` → table updates.

Add: form → `save()` → `POST /api/employees` → `INSERT` → `load()` again.

## How to run (demo)

1. Postgres running, DBeaver DB `emp_manage` created, `schema.sql` run  
2. `cd emp-api` → `node server.js` → port 3000  
3. `cd emp-fe` → `ng serve` → port 4200  
4. Browser `http://localhost:4200`

If table is empty: API not running, or CORS, or wrong `.env` password.

## Why `ng g c components/grid`

Lead wants CLI-generated folders:

```
src/app/components/grid/grid.ts
                         grid.html
                         grid.css
                         grid.spec.ts
```

`--type=""` makes `grid.ts` not `grid.component.ts`.

---


# A) Backend — emp-api (Node + Postgres)

```bash
mkdir emp-api
cd emp-api
npm init -y
npm install express cors dotenv pg
```

Create `.env` (your DBeaver password):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emp_manage
DB_USER=postgres
DB_PASSWORD=your_password
```

In DBeaver: create database `emp_manage`, then run `schema.sql`.

## File: emp-api/schema.sql

```sql
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  role VARCHAR(80) NOT NULL,
  department VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  start_date DATE NOT NULL,
  manager VARCHAR(100)
);

INSERT INTO employees (full_name, email, role, department, status, start_date, manager) VALUES
('Maya Patel', 'maya.patel@northstar.co', 'Product Designer', 'Product', 'Active', '2024-01-12', 'Noah Williams'),
('Noah Williams', 'noah.williams@northstar.co', 'Engineering Lead', 'Engineering', 'Active', '2022-10-03', NULL),
('Sofia Chen', 'sofia.chen@northstar.co', 'People Partner', 'People', 'On leave', '2023-03-18', 'Noah Williams'),
('Liam Brooks', 'liam.brooks@northstar.co', 'Finance Analyst', 'Finance', 'Active', '2024-06-27', 'Noah Williams'),
('Amara Okafor', 'amara.okafor@northstar.co', 'Account Executive', 'Sales', 'Active', '2023-02-09', 'Noah Williams'),
('Ethan Rivera', 'ethan.rivera@northstar.co', 'Support Specialist', 'Customer Care', 'Active', '2024-08-16', 'Noah Williams');
```

Add more INSERT rows if you want pagination (6 per page).

## File: emp-api/package.json scripts

```json
"scripts": {
  "start": "node server.js"
}
```

## File: emp-api/server.js

```js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const cols = `id, full_name, email, role, department, status, to_char(start_date, 'YYYY-MM-DD') as start_date, manager`;

app.get('/api/employees', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const department = (req.query.department || '').trim();
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;

    const where = [];
    const values = [];

    if (search) {
      values.push('%' + search + '%');
      where.push('(full_name ILIKE $' + values.length + ' OR email ILIKE $' + values.length + ' OR role ILIKE $' + values.length + ')');
    }
    if (department) {
      values.push(department);
      where.push('department = $' + values.length);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const count = await pool.query('SELECT COUNT(*) FROM employees ' + whereSql, values);

    values.push(limit);
    values.push(offset);
    const list = await pool.query(
      'SELECT ' + cols + ' FROM employees ' + whereSql + ' ORDER BY id ASC LIMIT $' + (values.length - 1) + ' OFFSET $' + values.length,
      values
    );

    res.json({
      data: list.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT ' + cols + ' FROM employees WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { full_name, email, role, department, status, start_date, manager } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (full_name, email, role, department, status, start_date, manager)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ` + cols,
      [full_name, email, role, department, status || 'Active', start_date, manager || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { full_name, email, role, department, status, start_date, manager } = req.body;
    const result = await pool.query(
      `UPDATE employees SET full_name=$1, email=$2, role=$3, department=$4, status=$5, start_date=$6, manager=$7
       WHERE id=$8 RETURNING ` + cols,
      [full_name, email, role, department, status, start_date, manager || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('emp-api running on ' + port));
```

Start:

```bash
node server.js
```

---

# B) Frontend — emp-fe (Angular 22 + PrimeNG)

If the Angular 22 app **already exists**, skip `ng new`. Only generate grid + service.

```bash
ng new emp-fe --routing --style=css --ssr=false
cd emp-fe
npm install primeng primeicons
```

PrimeNG CSS: add in `angular.json` styles (v17 style). On Angular 22, if those files are missing, follow PrimeNG docs for your version.

```
node_modules/primeng/resources/themes/lara-light-blue/theme.css
node_modules/primeng/resources/primeng.min.css
node_modules/primeicons/primeicons.css
src/styles.css
```

Generate (this is what your lead wants):

```bash
ng g c components/grid --type="" --style=css --standalone
ng g s employee --skip-tests
```

If `--type=""` is not allowed:

```bash
ng g c components/grid --style=css --standalone
```

Then rename `grid.component.ts` → `grid.ts` (and html/css) only if the lead wants short names.

You should have:

```
src/app/components/grid/grid.ts
src/app/components/grid/grid.html
src/app/components/grid/grid.css
src/app/employee.service.ts
```

## File: src/styles.css

```css
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, Segoe UI, Arial, sans-serif; background: #f4f6f8; color: #1f2937; }
```

## File: src/app/app.config.ts

Add HttpClient, animations, PrimeNG services. Keep `provideRouter` that `ng new` already added.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    ConfirmationService,
    MessageService
  ]
};
```

On Angular 22, if `provideAnimations` is deprecated, use `provideAnimationsAsync` from `@angular/platform-browser/animations/async`.

## File: src/app/employee.service.ts

```ts
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
```

## File: src/app/app.routes.ts

If `Grid` class is named `GridComponent`, import that instead.

```ts
import { Routes } from '@angular/router';
import { Grid } from './components/grid/grid';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: Grid }
];
```

## App layout

Type into the files `ng new` created (`app.ts` + `app.html` + `app.css`, or `app.component.*`).

### app html

```html
<div class="layout">
  <aside class="sidebar">
    <span class="logo">Y</span>
    <a routerLink="/employees" routerLinkActive="active" title="Employees">
      <i class="pi pi-users"></i>
    </a>
  </aside>
  <main class="main">
    <header class="topbar">
      <div>
        <b>IFF HR</b>
        <span class="muted"> / People operations</span>
      </div>
      <span class="avatar-sm">AK</span>
    </header>
    <router-outlet></router-outlet>
  </main>
</div>
```

In the app class, import `RouterOutlet, RouterLink, RouterLinkActive`.

### app css

```css
.layout { display: flex; min-height: 100vh; }
.sidebar {
  width: 72px;
  background: #2f80ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
}
.sidebar a {
  width: 40px; height: 40px; border-radius: 10px;
  color: #fff; display: flex; align-items: center; justify-content: center;
  text-decoration: none;
}
.sidebar a.active, .sidebar a:hover { background: rgba(255,255,255,.2); }
.logo {
  width: 36px; height: 36px; border-radius: 10px; background: #fff; color: #2f80ed;
  display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 16px;
}
.main { flex: 1; }
.topbar {
  height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; border-bottom: 1px solid #eee;
}
.avatar-sm {
  width: 32px; height: 32px; border-radius: 50%; background: #e8eefc; color: #2f80ed;
  display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;
}
.muted { color: #6b7280; font-size: 13px; }
```

## File: src/app/components/grid/grid.ts

On Angular 22, `CalendarModule` may be `DatePickerModule` (`primeng/datepicker`). `p-calendar` may be `p-datepicker`. If the old import fails, switch those two names.

```ts
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

  roles = ['Product Designer', 'Engineering Lead', 'People Partner', 'Finance Analyst', 'Account Executive', 'Support Specialist'];
  managers = ['Noah Williams', 'Sofia Chen'];
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
    return (name || '').split(' ').slice(0, 2).map(p => p[0] || '').join('').toUpperCase();
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
}
```

If class name from CLI is `GridComponent`, keep that name and use it in routes.

## File: src/app/components/grid/grid.html

```html
<p-toast></p-toast>
<p-confirmDialog></p-confirmDialog>

<div class="page">
  <div class="page-head">
    <div>
      <h2>Employees</h2>
      <p class="sub">Manage employee details, roles, and account access.</p>
    </div>
    <button pButton type="button" label="Add employee" icon="pi pi-plus" (click)="openAdd()"></button>
  </div>

  <div class="card">
    <div class="toolbar">
      <span class="p-input-icon-left search">
        <i class="pi pi-search"></i>
        <input pInputText [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search by name, email, or role" />
      </span>
      <div class="toolbar-right">
        <p-dropdown [options]="departments" [(ngModel)]="department" optionLabel="label" optionValue="value" (onChange)="onSearch()"></p-dropdown>
      </div>
    </div>

    <p-table [value]="list" [lazy]="true" [paginator]="true" [rows]="limit" [totalRecords]="total"
      [first]="(page - 1) * limit" (onPage)="onPage($event)" [rowsPerPageOptions]="[6,10,20]">
      <ng-template pTemplate="header">
        <tr>
          <th>EMPLOYEE</th>
          <th>ROLE</th>
          <th>DEPARTMENT</th>
          <th>STATUS</th>
          <th>START DATE</th>
          <th>ACTIONS</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td>
            <div class="emp">
              <span class="avatar">{{ initials(row.full_name) }}</span>
              <div>
                <div class="name">{{ row.full_name }}</div>
                <div class="mail">{{ row.email }}</div>
              </div>
            </div>
          </td>
          <td>{{ row.role }}</td>
          <td>{{ row.department }}</td>
          <td>
            <span class="badge" [class.leave]="row.status === 'On leave'">{{ row.status }}</span>
          </td>
          <td>{{ row.start_date | date:'dd MMM, yyyy' }}</td>
          <td>
            <button pButton type="button" icon="pi pi-pencil" class="p-button-text" (click)="openEdit(row)"></button>
            <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-danger" (click)="remove(row)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>
</div>

<p-dialog [(visible)]="showForm" [modal]="true" [style]="{width:'480px'}" [header]="isEdit ? 'Edit employee' : 'Add employee'">
  <label>Full name</label>
  <input pInputText [(ngModel)]="form.full_name" class="w100" />

  <label>Email</label>
  <input pInputText [(ngModel)]="form.email" class="w100" />

  <label>Role</label>
  <p-dropdown [options]="roles" [(ngModel)]="form.role" placeholder="Select role" styleClass="w100"></p-dropdown>

  <label>Department</label>
  <p-dropdown [options]="departments.slice(1)" optionLabel="label" optionValue="value" [(ngModel)]="form.department" placeholder="Select department" styleClass="w100"></p-dropdown>

  <label>Manager</label>
  <p-dropdown [options]="managers" [(ngModel)]="form.manager" placeholder="Select manager" [showClear]="true" styleClass="w100"></p-dropdown>

  <label>Start date</label>
  <p-calendar [(ngModel)]="startDate" dateFormat="dd M, yy" [showIcon]="true" styleClass="w100"></p-calendar>

  <label>Status</label>
  <p-dropdown [options]="statuses" [(ngModel)]="form.status" styleClass="w100"></p-dropdown>

  <ng-template pTemplate="footer">
    <button pButton type="button" label="Cancel" class="p-button-text" (click)="showForm = false"></button>
    <button pButton type="button" [label]="isEdit ? 'Save changes' : 'Add employee'" (click)="save()"></button>
  </ng-template>
</p-dialog>
```

On Angular 22 PrimeNG, `p-dropdown` may be `p-select`. If so, change the tag and import `SelectModule` from `primeng/select`.

## File: src/app/components/grid/grid.css

```css
.page { padding: 24px; }
.page-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.page-head h2 { margin: 0; }
.sub { color: #6b7280; font-size: 13px; margin: 4px 0 0; }
.card { background: #fff; border-radius: 12px; padding: 12px; }
.toolbar { display: flex; justify-content: space-between; gap: 12px; padding: 8px; }
.search input { width: 280px; padding-left: 32px; }
.emp { display: flex; align-items: center; gap: 10px; }
.name { font-weight: 600; }
.mail { color: #6b7280; font-size: 12px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #e8eefc; color: #2f80ed;
  display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;
}
.badge { background: #e8f8ee; color: #16803c; border-radius: 999px; padding: 4px 10px; font-size: 12px; }
.badge.leave { background: #fff4e5; color: #c2410c; }
.w100 { width: 100%; display: block; }
label { display: block; margin: 12px 0 4px; font-size: 13px; font-weight: 600; }
p-dropdown, p-calendar { width: 100%; display: block; }
```

---

# C) Run

Terminal 1: `cd emp-api && node server.js`  
Terminal 2: `cd emp-fe && ng serve`

Open `http://localhost:4200`
