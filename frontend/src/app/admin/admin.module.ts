import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateRescueTeamDialogComponent } from '../create-rescue-team-dialog/create-rescue-team-dialog.component';
import { RescueTeamInfoAdminDialogComponent } from '../rescue-team-info-admin-dialog/rescue-team-info-admin-dialog.component';
import { AssignRescueTeamDialogAdminComponent } from '../assign-rescue-team-dialog-admin/assign-rescue-team-dialog-admin.component';
import { CreateDepartmentAdminComponent } from '../create-department-admin/create-department-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    CreateRescueTeamDialogComponent,
    RescueTeamInfoAdminDialogComponent,
    AssignRescueTeamDialogAdminComponent,
    CreateDepartmentAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
