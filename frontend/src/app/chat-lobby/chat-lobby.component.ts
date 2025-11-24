import { Component, Inject, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { VictimServicesService } from '../services/victim-services.service';
import { RescueTeamService } from '../services/rescue-team.service';
import { RequestReceived } from '../model/RequestReceived';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WebSocketService } from '../services/web-socket.service';
// REMOVED invalid imports:
import { ChatMessageDto } from '../model/ChatMessageDto';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { chatMessage, Messagetype } from '../model/ChatMessage';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService} from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent implements OnInit {
  webSocketEndPoint: string = 'http://localhost:8080/ws';

  //topic: string = "/topic/greetings";
  request: RequestReceived;
  rescueTeam: any;
  messages: any[]=[];
  channelList: any[]=[];  // Changed to store team member objects
  user: any;
  chatMessage?: ChatMessageDto;
  chatform: any;
  message: any=[];
  messageInput: any;
  sentMessages: any[]=[];
  teamMembers: any[] = [];  // Store all team members
  selectedDepartmentId: number | null = null;
  departments: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private authService:AuthService,
    private webSocketService:WebSocketService,
    private dialog: MatDialog,
    private localStorage: LocalStorageService,
    private vicServices: VictimServicesService,
    private reqServices: RescueTeamService,
    private messageService: MessageService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.request = this.localStorage.retrieve('request');
    this.user = this.localStorage.retrieve('username');

    if (this.user != null) {
        this.authService.getUser(this.user).subscribe(
          (response:any)=>{
            console.log('User data received:', response);

            // Check if user is admin
            this.isAdmin = response.role === 'ROLE_ADMIN' || response.role === 'ADMIN';

            // Check if user has a rescue team (team member)
            if (response && response.rescueTeam && response.rescueTeam.id) {
              this.rescueTeam = response.rescueTeam;
              console.log('User is part of rescue team:', this.rescueTeam);

              // Fetch all teams from the same department
              if (this.rescueTeam.department && this.rescueTeam.department.id) {
                this.fetchDepartmentTeams(this.rescueTeam.department.id);
              } else {
                console.error('No department found for rescue team');
                this.channelList = [];
              }
            }
            // Check if user has department (admin/department head)
            else if (response && response.department && response.department.id) {
              console.log('User is admin/department head, fetching department teams');
              this.selectedDepartmentId = response.department.id;
              this.fetchDepartmentTeams(response.department.id);
            }
            // Check legacy rescueTeamId field
            else if (response && response.rescueTeamId) {
              this.rescueTeam = response.rescueTeamId;
              this.reqServices.getRescueTeam(response.rescueTeamId).subscribe(
                (teamResponse:any)=>{
                    console.log('Rescue team data received:', teamResponse);
                    this.rescueTeam = teamResponse;

                    if (teamResponse.department && teamResponse.department.id) {
                      this.fetchDepartmentTeams(teamResponse.department.id);
                    } else {
                      console.error('No department found for rescue team');
                      this.channelList = [];
                    }
                },
                (error) => {
                  console.error('Error fetching rescue team:', error);
                  this.channelList = [];
                }
              )
            }
            else {
              console.log('User has no rescue team or department - checking if admin');

              if (this.isAdmin) {
                // Admin without department - load all departments for selection
                this.loadDepartments();
              } else {
                this.channelList = [];
              }
            }
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        )

    }
    else {
      if (this.request && this.request.requestId) {
        this.vicServices.getRequest(this.request.requestId).subscribe(data => {
          this.webSocketService.subscribeToVictimchannel(this.request.requestId);
          var received_message_from_topic_chat=this.webSocketService.subscribeToTopicChat();

          console.log(received_message_from_topic_chat);
          if (data && data.resTeamObj) {
            this.rescueTeam = this.reqServices.getRescueTeam(data.resTeamObj).subscribe(
              (response) => {
                  this.rescueTeam = response;
                  // For victims, show the assigned rescue team info
                  this.channelList = [{
                    name: response.name || 'Rescue Team',
                    user: response.user,
                    status: response.status,
                    id: response.id
                  }];
                  console.log('Assigned rescue team:', this.channelList);
              },
              (error) => console.log(error)
            );
          } else {
            console.error('No rescue team object found in request data');
          }
        }, error => {
          console.log(error)
        });
      } else {
        console.error('No request found in local storage');
      }
      //  this.channelList=[this.emp1,this.emp2,this.emp3];
    }
    this.chatform = new FormGroup({
      messageInput: new FormControl(''),
    });

  }


  ngOnInit(): void {
    //this.request = this.localStorage.retrieve('request');this.request = this.localStorage.retrieve('request');
    this.messages = this.data;
    this.connect();
  }

  connect() {

    var received_message_from_topic_chat=this.webSocketService.subscribeToTopicChat();

    console.log(received_message_from_topic_chat);
   // this.sendMessage.push(received_message_from_topic_chat);
  }

  disconnect() {
    this.webSocketService.closeWebSocket();
  }


  sendMessage(){
    if(this.user!=null){this.sendMessageToVictim();}
    else{this.sendMessageToVictim();}
  }
  sendMessageToVictim(){
    if (!this.rescueTeam || !this.rescueTeam.requestId || !this.rescueTeam.id) {
      console.error('Cannot send message: rescue team data not loaded');
      return;
    }
    let messageContent = this.chatform.get('messageInput')!.value;
    if (!messageContent || messageContent.trim() === '') {
      return;
    }
    let channel = "/app/chat/" + this.rescueTeam.requestId + "/sendToVictim"
    let messageToSend = new ChatMessageDto(channel, Date(), this.request?.requestId?.toString() || '', messageContent, this.rescueTeam.id);
    this.sentMessages.push(messageToSend);
    this.messageService.sendMessageById(channel,messageToSend);
    this.chatform.get('messageInput')!.setValue('');
  }
  sendMessageToRescueTeam() {
    if (!this.rescueTeam || !this.rescueTeam.id) {
      console.error('Cannot send message: rescue team data not loaded');
      return;
    }
    let messageContent = this.chatform.get('messageInput')!.value;
    if (!messageContent || messageContent.trim() === '') {
      return;
    }
    let channel = "/app/chat/" + this.rescueTeam.id + "/sendToRescueTeam"
    let messageToSend = new ChatMessageDto(channel, Date(), this.request?.requestId?.toString() || '', messageContent, this.rescueTeam.id);
    this.sentMessages.push(messageToSend);
    this.messageService.sendMessageById(channel,messageToSend);
    this.chatform.get('messageInput')!.setValue('');
  }

  loadDepartments() {
    this.http.get<any[]>(`${environment.apiUrl}/departments`).subscribe(
      (departments) => {
        console.log('Departments loaded:', departments);
        this.departments = departments;

        // Auto-select first department if available
        if (departments.length > 0) {
          this.selectedDepartmentId = departments[0].id;
          this.onDepartmentChange(departments[0].id);
        }
      },
      (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
      }
    );
  }

  onDepartmentChange(departmentId: number) {
    this.selectedDepartmentId = departmentId;
    this.fetchDepartmentTeams(departmentId);
  }

  fetchDepartmentTeams(departmentId: number) {
    console.log('Fetching teams for department:', departmentId);
    this.reqServices.getTeamsByDepartment(departmentId).subscribe(
      (teams: any[]) => {
        console.log('Department teams received:', teams);
        this.teamMembers = teams;

        if (!teams || teams.length === 0) {
          console.log('No teams found for this department');
          this.channelList = [];
          return;
        }

        // Build channel list from team members
        this.channelList = teams.map(team => ({
          id: team.id,
          name: team.name,
          username: team.user?.username || team.user?.fullName || 'Unknown',
          status: team.status,
          location: team.currentLocation,
          isCurrentUser: this.rescueTeam && team.id === this.rescueTeam.id
        }));

        console.log('Channel list (team members):', this.channelList);
      },
      (error) => {
        console.error('Error fetching department teams:', error);
        console.error('Error details:', error.error);

        // Show a mock team for testing if backend fails
        this.channelList = [{
          id: 0,
          name: 'Backend Error',
          username: 'Please check backend server',
          status: 'OFFLINE',
          location: 'Error: ' + (error.message || 'Unknown error'),
          isCurrentUser: false
        }];
      }
    );
  }  fetchAllTeams() {
    this.reqServices.getAllTeams().subscribe(
      (teams: any[]) => {
        console.log('All teams received:', teams);
        this.teamMembers = teams;

        // Build channel list from all teams
        this.channelList = teams.map(team => ({
          id: team.id,
          name: team.name,
          username: team.user?.username || team.user?.fullName || 'Unknown',
          status: team.status,
          location: team.currentLocation,
          department: team.department?.name,
          isCurrentUser: false
        }));

        console.log('Channel list (all teams):', this.channelList);
      },
      (error) => {
        console.error('Error fetching all teams:', error);
        this.channelList = [];
      }
    );
  }

  close() {
    this.dialog.closeAll();
  }

}
