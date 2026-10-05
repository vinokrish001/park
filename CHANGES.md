# Lead review changes — do this on client laptop

Two points from tech lead:

1. Do **not** name it `grid.ts`. Name the file after the page work.
2. Use **lazy loading** in routes (`loadChildren`), same as company `app.routing.module.ts`.

---

## 1. Rename component (grid → employees)

Delete `src/app/components/grid/` if you already created it.

Generate with CLI:

```bash
ng g module employees --routing
ng g component employees --skip-selector=false --standalone=false
```

You should get:

```
src/app/employees/
  employees.component.ts
  employees.component.html
  employees.component.css
  employees.component.spec.ts
  employees.module.ts
  employees-routing.module.ts
```

Same idea as company `documents.component.ts` — name = feature.

- Class: `EmployeesComponent`
- Selector: `app-employees`
- `standalone: false` (declared in module, like their documents page)

Copy the table/dialog code from old `grid` into `employees.component.ts` / `.html` / `.css`.

Dashboard placeholder (optional, matches their `path: 'dashboard'`):

```bash
ng g module dashboard --routing
ng g component dashboard --standalone=false
```

---

## 2. Lazy load routes (like company code)

Company style:

```ts
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  data: { title: 'Dashboard' }
}
```

Our `app.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.module').then((m) => m.EmployeesModule),
    data: { title: 'Employees' }
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { title: 'Dashboard' }
  }
];
```

**Do not** import `EmployeesComponent` at the top of `app.routes.ts`.  
`loadChildren` + `import(...)` loads the module only when user opens that URL.

Child route inside `employees-routing.module.ts`:

```ts
const routes: Routes = [
  { path: '', component: EmployeesComponent, data: { title: 'Employees' } }
];
```

`path: ''` here means `/employees` shows the employees page.

---

## 3. Module files (keep small)

`employees.module.ts` — declare component, import PrimeNG + `EmployeesRoutingModule`.

`employees-routing.module.ts` — `RouterModule.forChild(routes)`.

We did **not** add `canActivate: [AuthGuard]` because this hands-on has no login. In their product they use AuthGuard. If lead asks, say: “AuthGuard when login is added.”

---

## 4. How to explain to lead

- `grid` was a generic name. Feature is employees, so `employees.component.ts`.
- Main `app.routes` uses `loadChildren` so employees JS is not in the first bundle.
- Same pattern as `user-management` / `dashboard` / `documents` in dct-web.

---

## 5. Check

```bash
ng serve
```

Open `/employees`. Table must still work. Click sidebar Dashboard → `/dashboard`.

---

## 6. Backend folder (lead: no SQL in model)

Same idea as `tcp-app` `apps/api/src/modules/feature-flags/`:

```
emp-api/src/
  main.ts
  database/database.ts
  modules/employees/
    employee.module.ts
    employee.controller.ts     HTTP only
    employee.service.ts        DB queries live here
    entities/employee.entity.ts   columns only, NO SQL
    dto/create-employee.dto.ts
    dto/update-employee.dto.ts
```

Delete old `server.js`. URLs stay `/api/employees`.

```bash
cd emp-api
npm install
npm start
```

Swagger: `http://localhost:3000/swagger`

**Say to lead:** entity = table shape. service = findAll/create/update/delete SQL. controller = req/res. Swagger like tcp-app API docs.
