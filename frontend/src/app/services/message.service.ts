import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessageDto} from '../model/ChatMessageDto';
import { WebSocketService} from '../services/web-socket.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private httpClient: HttpClient,private websocketService:WebSocketService) { }

  getMessageByRequestId(requestId:number):Observable<any>{
    const params = new HttpParams().append('requestId',requestId.toString());
    return this.httpClient.get(`${environment.apiUrl}/message/getmessagesByRequestId/`,{params:params});
  }

  getMessageByUserId(userId:number):Observable<any>{
    const params = new HttpParams().append('userId',userId.toString());
     return this.httpClient.get(`${environment.apiUrl}/message/getmessagesByUserId/`,{params:params});
  }



  sendMessageToRescueTeam(messageToSend:ChatMessageDto) {

    let channel = "/app/chat/" + messageToSend.receiver + "/sendToRescueTeam"
    this.websocketService.sendMessage(channel,messageToSend);
   }

   sendMessageToVictim(messageToSend:ChatMessageDto){
     let channel = "/app/chat/" + messageToSend.receiver + "/sendToVictim"
     this.websocketService.sendMessage(channel,messageToSend);
   }


   sendMessageById(channel:string,messageToSend:ChatMessageDto){
    this.websocketService.sendMessage(channel,messageToSend);
   }


}
