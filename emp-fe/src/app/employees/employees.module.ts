import { NgModule } from '@angular/core';
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
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';

@NgModule({
  declarations: [EmployeesComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmployeesRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule
  ]
})
export class EmployeesModule {}
