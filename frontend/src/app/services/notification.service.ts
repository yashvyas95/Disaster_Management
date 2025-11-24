import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmergencyNotification {
  id: number;
  victimName: string;
  location: string;
  emergencyType: string;
  priority: string;
  status: string;
  createdAt: string;
  message?: string;
}

/**
 * Service for real-time notifications via WebSocket
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private client: Client;
  private connected = new BehaviorSubject<boolean>(false);
  private newRequests = new BehaviorSubject<EmergencyNotification | null>(null);
  private statusUpdates = new BehaviorSubject<EmergencyNotification | null>(null);
  private teamAssignments = new BehaviorSubject<EmergencyNotification | null>(null);

  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.websocketUrl),
      connectHeaders: {},
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = (frame) => {
      console.log('WebSocket Connected:', frame);
      this.connected.next(true);
      this.subscribeToChannels();
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket Error:', frame.headers['message']);
      console.error('Details:', frame.body);
      this.connected.next(false);
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket Disconnected');
      this.connected.next(false);
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (!this.client.active) {
      console.log('Activating WebSocket connection...');
      this.client.activate();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client.active) {
      console.log('Deactivating WebSocket connection...');
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
    }
  }

  /**
   * Subscribe to all notification channels
   */
  private subscribeToChannels(): void {
    // Subscribe to new emergency requests
    const newRequestSub = this.client.subscribe('/topic/emergency/new', (message) => {
      const notification: EmergencyNotification = JSON.parse(message.body);
      console.log('New emergency request:', notification);
      this.newRequests.next(notification);
    });
    this.subscriptions.set('newRequests', newRequestSub);

    // Subscribe to status updates
    const statusUpdateSub = this.client.subscribe('/topic/emergency/updates', (message) => {
      const notification: EmergencyNotification = JSON.parse(message.body);
      console.log('Status update:', notification);
      this.statusUpdates.next(notification);
    });
    this.subscriptions.set('statusUpdates', statusUpdateSub);

    console.log('Subscribed to notification channels');
  }

  /**
   * Subscribe to specific emergency request updates
   */
  subscribeToRequest(requestId: number): Observable<EmergencyNotification> {
    const subject = new BehaviorSubject<EmergencyNotification | null>(null);

    if (this.client.connected) {
      const sub = this.client.subscribe(`/topic/emergency/status/${requestId}`, (message) => {
        const notification: EmergencyNotification = JSON.parse(message.body);
        subject.next(notification);
      });
      this.subscriptions.set(`request-${requestId}`, sub);
    }

    return subject.asObservable() as Observable<EmergencyNotification>;
  }

  /**
   * Subscribe to team assignments (for department heads)
   */
  subscribeToTeamAssignments(teamId: number): void {
    if (this.client.connected) {
      const sub = this.client.subscribe(`/topic/team/${teamId}/assignments`, (message) => {
        const notification: EmergencyNotification = JSON.parse(message.body);
        console.log('Team assignment:', notification);
        this.teamAssignments.next(notification);
      });
      this.subscriptions.set(`team-${teamId}`, sub);
    }
  }

  /**
   * Observable streams for notifications
   */
  get connectionStatus$(): Observable<boolean> {
    return this.connected.asObservable();
  }

  get newRequests$(): Observable<EmergencyNotification | null> {
    return this.newRequests.asObservable();
  }

  get statusUpdates$(): Observable<EmergencyNotification | null> {
    return this.statusUpdates.asObservable();
  }

  get teamAssignments$(): Observable<EmergencyNotification | null> {
    return this.teamAssignments.asObservable();
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.client.connected;
  }
}
