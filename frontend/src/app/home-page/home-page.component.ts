import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { RescueTeam } from '../model/RescueTeam';
//import {  } from '../services/authentication.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RescueTeamDialogComponent } from '../rescue-team-dialog/rescue-team-dialog.component';
import { RescueTeamInfoDialogComponent } from '../rescue-team-info-dialog/rescue-team-info-dialog.component';
import { EmployesInfoDialogComponent } from "../employes-info-dialog/employes-info-dialog.component";
import { AllMessagesDialogComponent } from '../all-messages-dialog/all-messages-dialog.component';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService} from '../services/message.service';
import { ChatLobbyComponent} from '../chat-lobby/chat-lobby.component';
import { AuthService } from '../services/auth.service';
import { RescueTeamService} from '../services/rescue-team.service';
import { RequestService } from '../services/request.service';
import { User } from '../model/User';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  rescueTeamId = 0;
  password = 'user';
  user: any;
  username:string='';
  rescueTeam: any;
  requestAssignedToUser: any[] = [];
  AllUsers: any[] = [];
  newMessages: any[] = [];
  requestDialogOpen = false;
  rescueInfoDialogOpen = false;
  employeeInfoDialogOpen = false;
  active_request: any[] = [];
  ws: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['sender', 'content'];
  displayedColumnsForRequest = ['requestId', 'name', 'location','resTeamObj', 'actions'];
  allMessages: any[] = [];


  constructor(private websocketService:WebSocketService,private requestService: RequestService,private rescueTeamService : RescueTeamService ,private authService:AuthService, private messageService:MessageService,private router: Router, private localStorage: LocalStorageService, private http: HttpClient, public dialog: MatDialog) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Simple filter - in production, you'd use MatTableDataSource
    if (filterValue && this.active_request) {
      const filtered = this.active_request.filter((req: any) =>
        req.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        req.location?.toLowerCase().includes(filterValue.toLowerCase())
      );
      this.active_request = filtered;
    } else {
      // Reload original data
      this.loadActiveRequests();
    }
  }

  viewDetails(element: any) {
    console.log('View details for:', element);
    // Implement view details logic
  }

  loadActiveRequests() {
    if (this.user?.rescueTeamId) {
      this.requestService.getUserActiveRequest(this.user.rescueTeamId).subscribe(
        (response: any) => {
          this.active_request = response || [];
        },
        (error) => {
          console.error('Error loading active requests:', error);
          this.active_request = [];
        }
      );
    }
  }

  ngOnInit(): void {
    this.username = this.localStorage.retrieve('username');
    console.log(this.username);
    this.connect();
    this.newMessages = [];

    this.authService.getUser(this.username).subscribe(
      (response: any) => {
        this.user = response;

        // Load rescue team info
        if (response.rescueTeamId) {
          this.rescueTeamService.getRescueTeam(response.rescueTeamId).subscribe(
            (teamResponse) => {
              this.rescueTeam = [teamResponse];
            },
            (error) => {
              console.error('Error loading rescue team:', error);
              this.rescueTeam = [];
            }
          );

          // Load requests assigned to team
          this.rescueTeamService.getRequestFromRequestId(response.rescueTeamId).subscribe(
            (requestResponse) => {
              this.requestAssignedToUser = requestResponse || [];
            },
            (error) => {
              console.error('Error loading assigned requests:', error);
              this.requestAssignedToUser = [];
            }
          );

          // Load active requests
          this.requestService.getUserActiveRequest(response.rescueTeamId).subscribe(
            (activeResponse: any) => {
              this.active_request = activeResponse || [];
            },
            (error) => {
              console.error('Error loading active requests:', error);
              this.active_request = [];
            }
          );
        }

        // Load user messages
        this.messageService.getMessageByUserId(response.userId).subscribe(
          (msgResponse) => {
            this.allMessages = msgResponse || [];
          },
          (error) => {
            console.error('Error loading messages:', error);
            this.allMessages = [];
          }
        );
      },
      (error) => {
        console.error('Error loading user:', error);
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

    this.websocketService.connectToWebSocket();
  }


  openRescueDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.requestAssignedToUser;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "50%";
    dialogConfig.width = "60%";
    dialogConfig.position = { top: "100px", left: "" }
    if (!this.requestDialogOpen) { this.dialog.open(RescueTeamDialogComponent, dialogConfig); this.requestDialogOpen = true; }
    else { this.dialog.closeAll(); this.requestDialogOpen = false; }
  }

  openRescueTeamInfo(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.rescueTeam;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: "100px", left: "" }
    if (!this.rescueInfoDialogOpen) { this.dialog.open(RescueTeamInfoDialogComponent, dialogConfig); this.rescueInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.rescueInfoDialogOpen = false; }
  }

  openEmployeesInfoDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.AllUsers;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: "100px", left: "" };
    if (!this.employeeInfoDialogOpen) { this.dialog.open(EmployesInfoDialogComponent, dialogConfig); this.employeeInfoDialogOpen = true; }
    else { this.dialog.closeAll(); this.employeeInfoDialogOpen = false; }
  }

  openallMessageDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = this.allMessages;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: "100px", left: "" };
    if (!this.employeeInfoDialogOpen) { this.dialog.open(AllMessagesDialogComponent, dialogConfig); this.employeeInfoDialogOpen = true; }
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



  connect() {
    let socket = new SockJS("http://localhost:8080/socket");
    this.ws = Stomp.Stomp.over(socket);
    this.ws.connect({}, (frame: any) => {
      this.ws.subscribe("/topic/chat", (message: { body: string; }) => {
        var MessageReceived = JSON.parse(message.body);
        this.newMessages.push(MessageReceived);
        console.log("ALL MESSAGES" + MessageReceived.content);
      });

    });


  }
}
