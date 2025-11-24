import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RequestService} from '../services/request.service';
import { ChatMessageDto } from '../model/ChatMessageDto';
import { chatMessage, Messagetype } from '../model/ChatMessage';
@Component({
  selector: 'app-message-to-victim',
  templateUrl: './message-to-victim.component.html',
  styleUrls: ['./message-to-victim.component.css']
})
export class MessageToVictimComponent implements OnInit {
  
  RequestElement : any;
  messageVictimForm:FormGroup;
  message:any;
  ws:any;
  user : any
  messages:string[]=[];
  constructor(public dialogRef: MatDialogRef<MessageToVictimComponent>,private localStorage: LocalStorageService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,public requestService : RequestService) { 
    this.messageVictimForm = new FormGroup({
      message:new FormControl('')
    });
    this.requestService.getRequest(this.data).subscribe(
      (response)=>{
        this.RequestElement=response;
        console.log(response);

      },
      (error)=>{
        console.log(error);
      }
    );  
    this.user = this.localStorage.retrieve('username');
  }

  ngOnInit(): void {
    this.connect();
  }
  
  connect(){
    let socket = new SockJS("http://localhost:8080/socket");
    this.ws = Stomp.Stomp.over(socket);
    let topic = "/topic/chat/"+
    this.ws.connect({}, (frame: any) => {
      this.ws.subscribe("/errors", function(message: { body: string; }) {
        alert("Error " + message.body);
      });
       
      var dataReceived:string='';
      this.ws.subscribe("/topic/chat", function(message: { body: string; }) {
        console.log(JSON.parse(message.body.toString()));
        dataReceived=JSON.parse(message.body);
        console.log("----------............asdasd."+dataReceived);
      });
      this.messages.push(dataReceived);
    });
  }

  close(){
    console.log("MessageFromADMIN"+this.messageVictimForm.get('message')!.value);
    this.dialogRef.close();
    console.log("INSIDE-MESSAGE-DIALOG"+this.data);
  }

  sendMessage(){
    console.log("MessageFromADMIN"+this.messageVictimForm.get('message')!.value);
    console.log("INSIDE-MESSAGE-DIALOG"+this.data);

    let channel = "/app/chat/"+this.RequestElement.requestId+"/send";
    let date = new Date();
    

    //let messageToSend = new chatMessage(Messagetype.CHAT,this.messageVictimForm.get('message')!.value,this.user);
    let messageToSend = new ChatMessageDto(channel,date.toString(),this.user,this.messageVictimForm.get('message')!.value,this.RequestElement.requestId);
    //let messageToSend = new chatMessage(Messagetype.CHAT,messageContent,"request");
   
  console.log(messageToSend);
    this.ws.send("/app/chat/"+this.RequestElement.requestId+"/send", {},JSON.stringify(messageToSend));
    console.log(this.messageVictimForm.get('message')!.value);
    
  }
}
