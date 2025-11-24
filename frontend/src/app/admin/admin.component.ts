import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { EmployesInfoDialogComponent } from '../employes-info-dialog/employes-info-dialog.component';
import { User } from '../model/User';
import { RescueTeamDialogComponent } from '../rescue-team-dialog/rescue-team-dialog.component';
//import { RescueTeamInfoDialogComponent } from '../rescue-team-info-dialog/rescue-team-info-dialog.component';
import { RescueTeamInfoAdminDialogComponent } from '../rescue-team-info-admin-dialog/rescue-team-info-admin-dialog.component';
import { AuthService } from '../services/auth.service';
import { CreateRescueTeamDialogComponent } from '../create-rescue-team-dialog/create-rescue-team-dialog.component';
import { ChatLobbyComponent } from '../chat-lobby/chat-lobby.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { CreateDepartmentAdminComponent } from '../create-department-admin/create-department-admin.component';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AllMessagesDialogComponent } from '../all-messages-dialog/all-messages-dialog.component';
import { RequestService } from '../services/request.service';
import { RescueTeamService } from '../services/rescue-team.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']

})
export class AdminComponent implements OnInit {
  rescueTeamId = 0;
  password = 'user';
  user: any;
  rescueTeam: any[] = [];
  AllUsers: any[] = [];
  request: any[] = [];
  activeRequests: any[] = [];
  requestDialogOpen = false;
  rescueInfoDialogOpen = false;
  employeeInfoDialogOpen = false;
  username: any;
  messages: any[] = [];
  displayedColumns=['sender','content','timestamp'];

  // Statistics
  activeEmergenciesCount = 0;
  availableTeamsCount = 0;
  totalTeamsCount = 0;
  unreadMessagesCount = 0;
  completedTodayCount = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private requestService: RequestService,
    private rescueTeamService: RescueTeamService,
    private router: Router,
    private localStorage: LocalStorageService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {


    this.username = this.localStorage.retrieve('username');
    this.authService.getUser(this.username).subscribe(
      (response: any) => {
        this.messageService.getMessageByUserId(response.userId).subscribe(
          (response) => {
            this.messages = response;
          }
        );
      })
  }

  ngOnInit(): void {
    this.username = this.localStorage.retrieve('username');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load user info and messages
    this.authService.getUser(this.username).subscribe(
      (response: any) => {
        this.user = response;
        this.messageService.getMessageByUserId(response.userId).subscribe(
          (messages: any[]) => {
            this.messages = messages || [];
            this.calculateUnreadMessages();
          },
          (error) => {
            console.error('Error loading messages:', error);
            this.messages = [];
          }
        );
      },
      (error) => console.error('Error loading user:', error)
    );

    // Load all requests
    this.http.get<any[]>(`${this.getApiUrl()}/request/getAll/`).subscribe(
      (response) => {
        this.request = response || [];
        this.calculateRequestStatistics();
      },
      (error) => {
        console.error('Error loading requests:', error);
        this.request = [];
      }
    );

    // Load active requests
    this.requestService.getAllActiveRequest().subscribe(
      (response) => {
        this.activeRequests = response || [];
        this.activeEmergenciesCount = this.activeRequests.length;
      },
      (error) => {
        console.error('Error loading active requests:', error);
        this.activeRequests = [];
      }
    );

    // Load rescue teams
    this.rescueTeamService.getAllTeams().subscribe(
      (response) => {
        this.rescueTeam = response || [];
        this.calculateTeamStatistics();
      },
      (error) => {
        console.error('Error loading rescue teams:', error);
        this.rescueTeam = [];
      }
    );

    // Load all users
    this.authService.getAllUser().subscribe(
      (response: any) => {
        this.AllUsers = response || [];
      },
      (error) => {
        console.error('Error loading users:', error);
        this.AllUsers = [];
      }
    );
  }

  getApiUrl(): string {
    return 'http://localhost:8080/api';
  }

  calculateRequestStatistics(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.completedTodayCount = this.request.filter(req => {
      if (req.status === 'COMPLETED' && req.completedDate) {
        const completedDate = new Date(req.completedDate);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      }
      return false;
    }).length;
  }

  calculateTeamStatistics(): void {
    this.totalTeamsCount = this.rescueTeam.length;
    this.availableTeamsCount = this.rescueTeam.filter(
      team => team.status === 'AVAILABLE' || team.status === 'IDLE' || !team.status
    ).length;
  }

  calculateUnreadMessages(): void {
    this.unreadMessagesCount = this.messages.filter(
      msg => !msg.read && msg.read !== undefined
    ).length;

    // If read status not tracked, use a simpler count
    if (this.unreadMessagesCount === 0 && this.messages.length > 0) {
      this.unreadMessagesCount = this.messages.length;
    }
  }

  openRescueDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.request;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: "100px", left: "" };
    dialogConfig.width = "200%";
    if (!this.requestDialogOpen) { this.dialog.open(RescueTeamDialogComponent, dialogConfig); this.requestDialogOpen = true; }
    else { this.dialog.closeAll(); this.requestDialogOpen = false; }
  }

  openRescueTeamInfo(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.rescueTeam;
    dialogConfig.autoFocus = true;
    if (!this.rescueInfoDialogOpen) { this.dialog.open(RescueTeamInfoAdminDialogComponent, dialogConfig); this.rescueInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.rescueInfoDialogOpen = false; }
  }

  openEmployeesInfoDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.AllUsers;
    dialogConfig.autoFocus = true;
    if (!this.employeeInfoDialogOpen) { this.dialog.open(EmployesInfoDialogComponent, dialogConfig); this.employeeInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.employeeInfoDialogOpen = false; }
  }

  openChatLobby() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data;
    dialogConfig.width = "200%";
    dialogConfig.position = { top: "100px", left: "" };
    this.dialog.open(ChatLobbyComponent, dialogConfig);
  }

  createRescueTeam(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.AllUsers;
    if (!this.employeeInfoDialogOpen) { this.dialog.open(CreateRescueTeamDialogComponent, dialogConfig); this.employeeInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.employeeInfoDialogOpen = false; }
  }

  createDepartment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.AllUsers;
    this.dialog.open(CreateDepartmentAdminComponent, dialogConfig);
  }

  openDepartmentDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data;
    this.dialog.open(DepartmentsComponent, dialogConfig);
  }

  openallMessageDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.messages;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: "100px", left: "" };
    if (!this.employeeInfoDialogOpen) { this.dialog.open(AllMessagesDialogComponent, dialogConfig); this.employeeInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.employeeInfoDialogOpen = false; }
  }


}
