import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { ChatMessageDto } from '../model/ChatMessageDto';
import { webSocket} from 'rxjs/webSocket';
import { Observable, Subject, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  topic : String = "/topic/chat";
  stompClient: any;
  webSocket: any;
  chatMessages: any = [];
  backendsocket_URL = `${environment.apiUrl.replace('/api', '')}/socket`;
  socket:any;

  // Reconnection properties
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private connectionStatus$ = new Subject<boolean>();

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.socket = new SockJS(this.backendsocket_URL);
    this.webSocket = Stomp.Stomp.over(this.socket);
    this.webSocket.debug = null; // Disable debug logs
    this.connectToWebSocket();
    this.subscribeToTopicChat();
  }

  connectToWebSocket(){
    this.webSocket = Stomp.Stomp.over(this.socket);
    this.webSocket.connect({},
      (frame:any) => {
        // Connection successful
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.connectionStatus$.next(true);
        console.log('WebSocket connected successfully');
      },
      (error: any) => {
        // Connection failed
        this.isConnected = false;
        this.connectionStatus$.next(false);
        console.error('WebSocket connection error:', error);
        this.attemptReconnect();
      }
    );
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

      timer(delay).subscribe(() => {
        this.socket = new SockJS(this.backendsocket_URL);
        this.webSocket = Stomp.Stomp.over(this.socket);
        this.connectToWebSocket();
      });
    } else {
      console.error('Max reconnection attempts reached. Please refresh the page.');
    }
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  subscribeToVictimchannel(requestId:number){
    this.webSocket = Stomp.Stomp.over(this.socket);
    this.webSocket=this.webSocket.connect({},(frame:any)=>{});
      this.webSocket.subscribe("/topic/chat/"+requestId.toString(),(message: { body: string; }) => {
        console.log(message.body);
        return message.body;
      });
  }
  subscribeToRescueTeamChannel(){}

  subscribeToTopicChat():any{
    if (!this.isConnected) {
      console.warn('WebSocket not connected. Waiting for connection...');
      // Subscribe when connection is established
      this.connectionStatus$.subscribe(connected => {
        if (connected) {
          this.performSubscription();
        }
      });
      return;
    }
    this.performSubscription();
  }

  private performSubscription(): void {
    this.webSocket = Stomp.Stomp.over(this.socket);
    this.webSocket.connect({},(frame:any)=>{
      this.webSocket.subscribe("/topic/chat", (message: { body: string; }) => {
        console.log('Chat message received:', message.body);
        return message.body;
      });
    });
  }

  sendMessage(channel:string,message:ChatMessageDto):void{
    if (!this.isConnected) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }
    this.webSocket.send(channel,{},JSON.stringify(message));
  }

  public closeWebSocket():void{
    this.isConnected = false;
    if (this.webSocket) {
      this.webSocket.disconnect();
    }
  }



}
