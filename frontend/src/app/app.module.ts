import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestComponent } from './request/request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {MatGridListModule} from '@angular/material/grid-list';
//import {MatTableModule} from '@angular/material/table';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LogoutComponent } from './logout/logout.component';
import { HomePageComponent } from './home-page/home-page.component';
//import { WebsocketService} from '../app/services/websocket.service';
import {ChatService} from '../app/services/chat-service.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TokenInterceptor } from './services/token-interceptor';
//import { HttpInterceptorService } from './services/http-interceptor.service';
import { provideNgxWebstorage, withLocalStorage, withSessionStorage, withNgxWebstorageConfig } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { SignupComponent } from './signup/signup.component';
import { RescueTeamComponent } from './rescue-team/rescue-team.component';
import { HeaderComponent } from './header/header.component';

import { SidebarComponent } from './sidebar/sidebar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import {MatMenuModule} from '@angular/material/menu';
//import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RescueTeamDialogComponent} from '../app/rescue-team-dialog/rescue-team-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { RescueTeamInfoDialogComponent } from './rescue-team-info-dialog/rescue-team-info-dialog.component';
import { EmployesInfoDialogComponent } from './employes-info-dialog/employes-info-dialog.component';
import { CommunicationLobbyComponent } from './communication-lobby/communication-lobby.component';
import { MessageToVictimComponent } from './message-to-victim/message-to-victim.component';
import { DepartmentsComponent } from './departments/departments.component';
import { RequestLandingComponent } from './request-landing/request-landing.component';
import { RequestLoginComponent } from './request-login/request-login.component';
import { AllMessagesDialogComponent } from './all-messages-dialog/all-messages-dialog.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { VictimRegistrationComponent } from './victim-registration/victim-registration.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { VictimDashboardComponent } from './dashboards/victim-dashboard/victim-dashboard.component';
import { DepartmentDashboardComponent } from './dashboards/department-dashboard/department-dashboard.component';
import { SendMessageDialogComponent } from './components/send-message-dialog/send-message-dialog.component';
import { MessageInboxComponent } from './components/message-inbox/message-inbox.component';
import { UnifiedMessagingComponent } from './components/unified-messaging/unified-messaging.component';

@NgModule({
  declarations: [
    AppComponent,
    RequestComponent,
    LoginComponent,
    UserComponent,
    LogoutComponent,
    HomePageComponent,
    SignupComponent,
    RescueTeamComponent,
    HeaderComponent,
    SidebarComponent,
    ToolbarComponent,
    RescueTeamDialogComponent,
    RescueTeamInfoDialogComponent,
    EmployesInfoDialogComponent,
    CommunicationLobbyComponent,
    MessageToVictimComponent,
    DepartmentsComponent,
    RequestLandingComponent,
    RequestLoginComponent,
    AllMessagesDialogComponent,
    LoadingSpinnerComponent,
    VictimRegistrationComponent,
    AdminDashboardComponent,
    VictimDashboardComponent,
    DepartmentDashboardComponent,
    SendMessageDialogComponent,
    MessageInboxComponent,
    UnifiedMessagingComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatGridListModule,
    MatTableModule,
    MatCheckboxModule,
    MatListModule,
    MatToolbarModule,
    ToastrModule.forRoot(),
    MatSidenavModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideNgxWebstorage(
      withLocalStorage(),
      withSessionStorage(),
      withNgxWebstorageConfig({ separator: ':', caseSensitive: true })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
