import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent } from '../app/login/login.component'
import {RequestComponent} from '../app/request/request.component'
import {LogoutComponent } from '../app/logout/logout.component'
import { HomePageComponent} from '../app/home-page/home-page.component';
import { UrlPermission} from '../app/services/urlPermission';
import {  SignupComponent} from '../app/signup/signup.component';
import { HeaderComponent} from '../app/header/header.component';
import { SidebarComponent } from '../app/sidebar/sidebar.component';
import { ToolbarComponent } from '../app/toolbar/toolbar.component';
import { RequestLandingComponent } from '../app/request-landing/request-landing.component';
import { RequestLoginComponent } from '../app/request-login/request-login.component';
import { AuthGuard } from '../app/guards/auth.guard';
import { VictimRegistrationComponent } from '../app/victim-registration/victim-registration.component';
import { AdminDashboardComponent } from '../app/dashboards/admin-dashboard/admin-dashboard.component';
import { VictimDashboardComponent } from '../app/dashboards/victim-dashboard/victim-dashboard.component';
import { DepartmentDashboardComponent } from '../app/dashboards/department-dashboard/department-dashboard.component';

const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  {path : 'register-victim' , component : VictimRegistrationComponent},
  {path : 'request' , component : RequestComponent},
  {path : 'logout' , component : LogoutComponent, canActivate: [AuthGuard]},
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'manage', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
    ],
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'victim',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: VictimDashboardComponent }
    ],
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_VICTIM'] }
  },
  {
    path: 'department',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DepartmentDashboardComponent }
    ],
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_DEPARTMENT_HEAD', 'ROLE_DISPATCHER', 'ROLE_RESCUE_TEAM_MEMBER'] }
  },
  {path : 'signup' , component : SignupComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }},
  {path : 'header' , component : HeaderComponent, canActivate: [AuthGuard]},
  {
    path: 'chatLobby',
    loadChildren: () => import('./chat-lobby/chat-lobby.module').then(m => m.ChatLobbyModule),
    canActivate: [AuthGuard]
  },
  {path : '' , component: LoginComponent},
  {path : 'sidebar' , component: SidebarComponent, canActivate: [AuthGuard]},
  {path : 'toolbar' , component: ToolbarComponent, canActivate: [AuthGuard]},
  {path : 'home' , component: HomePageComponent, canActivate: [AuthGuard]},
  {path : 'requestLanding' , component: RequestLandingComponent},
  {path : 'requestLogin' , component: RequestLoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
