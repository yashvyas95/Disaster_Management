import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { ChatLobbyComponent } from '../chat-lobby/chat-lobby.component';
import { environment } from '../../environments/environment';

export class WebSocketAPI {
    webSocketEndPoint: string = environment.websocketUrl;
    topic: string = "/topic/greetings";
    stompClient: any;
    appComponent: ChatLobbyComponent;
    constructor(appComponent: ChatLobbyComponent){
        this.appComponent = appComponent;
    }
    const client = new StompJs.Client({
        brokerURL: 'ws://localhost:15674/ws',
        connectHeaders: {
          login: 'user',
          passcode: 'password',
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Fallback code
      if (typeof WebSocket !== 'function') {
        // For SockJS you need to set a factory that creates a new SockJS instance
        // to be used for each (re)connect
        client.webSocketFactory = function () {
          // Note that the URL is different from the WebSocket URL
          return new SockJS('http://localhost:15674/stomp');
        };
      }

      client.onConnect = function (frame) {
        // Do something, all subscribes must be done is this callback
        // This is needed because this will be executed after a (re)connect
      };

      client.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      };

      client.activate();
    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient =  this.getWebSocket();
        const _this = this;
        _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    getWebSocket(){
        return new WebSocket(environment.websocketUrl);
    }

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: string) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

 /**
  * Send message to sever via web socket
  * @param {*} message
  */
    _send(message: any) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message: string) {
        console.log("Message Recieved from Server :: " + message);
        this.appComponent.handleMessage(JSON.stringify(message.body));
    }



}
