import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { Stomp } from '@stomp/stompjs';
import { LocalStorageService } from 'ngx-webstorage';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatMessage, Messagetype } from '../model/ChatMessage';
import { RequestService } from '../services/request.service';
import { ChatMessageDto } from '../model/ChatMessageDto';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-message-to-user-dialog',
  templateUrl: './message-to-user-dialog.component.html',
  styleUrls: ['./message-to-user-dialog.component.css']
})
export class MessageToUserDialogComponent implements OnInit {
 // communicatioMessages:string[]=[];
  UserElement : any;
  messageToUserForm : FormGroup;
  receivingUser:any;
  sendingUser:any;
  ws:any;
  user : any
  coms:string[]=[];
  constructor(private authService:AuthService,public dialogRef: MatDialogRef<MessageToUserDialogComponent>,private localStorage: LocalStorageService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,public requestService : RequestService) { 
    this.messageToUserForm = new FormGroup({
      message:new FormControl('')
    });
    this.user = this.localStorage.retrieve('username');
    this.receivingUser=this.data;
    this.sendingUser=this.user;
  }

  ngOnInit(): void {
    this.connect();
    console.log("INMESSAGE TO USER DIALOG"+this.data);
  }
  
  connect(){
    let socket = new SockJS("http://localhost:8080/socket");
    this.ws = Stomp.Stomp.over(socket);
    let topic = "/topic/chat/"+ 
    this.ws.connect({}, (frame: any) => {
      this.ws.subscribe("/errors", function(message: { body: string; }) {
        alert("Error " + message.body);
      });

      this.ws.subscribe("/topic/chat/"+this.data, function(message: { body: string; }) {
        var x = JSON.parse(message.body);
        console.log("----------............asdasd."+x);
      });
      this.ws.subscribe("/topic/chat", function(message: { body: string; }) {
        var x = (JSON.parse(message.body));
        console.log("----------............asdasd."+x);
      });
    
      
    });
  }

  close(){
    console.log("MessageFromADMIN"+this.messageToUserForm.get('message')!.value);
    this.dialogRef.close();
    console.log("INSIDE-MESSAGE-DIALOG"+this.data);
  }

  sendMessage(){
    this.coms.push(this.messageToUserForm.get('message')!.value);
    console.log("SENDING USER"+this.sendingUser);
    console.log("RECEIVING  USER"+this.receivingUser);
    let instantDate = Date();
    this.authService.getUser(this.sendingUser).subscribe(
      (response:any)=>{
        let channel = "/app/chat/"+response.userId+"/sendToUser";   
        let messageDTOtoSend = new ChatMessageDto(channel,instantDate,this.user,this.messageToUserForm.get('message')!.value,this.data);
        this.ws.send(channel, {},JSON.stringify(messageDTOtoSend));
    
      }
    );    
  }
}
