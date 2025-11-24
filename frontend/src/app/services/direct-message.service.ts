import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DirectMessage {
  id: number;
  sender: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
  recipient: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  relatedRequest?: any;
}

export interface DirectMessageDto {
  recipientId: number;
  content: string;
  relatedRequestId?: number;
}

export interface UserRecipient {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {

  constructor(private http: HttpClient) { }

  sendMessage(dto: DirectMessageDto): Observable<DirectMessage> {
    return this.http.post<DirectMessage>(`${environment.apiUrl}/direct-messages`, dto);
  }

  getConversation(userId: number): Observable<DirectMessage[]> {
    return this.http.get<DirectMessage[]>(`${environment.apiUrl}/direct-messages/conversation/${userId}`);
  }

  getMyMessages(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/direct-messages/my-messages?page=${page}&size=${size}`);
  }

  getUnreadMessages(): Observable<DirectMessage[]> {
    return this.http.get<DirectMessage[]>(`${environment.apiUrl}/direct-messages/unread`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/direct-messages/unread-count`);
  }

  markAsRead(messageId: number): Observable<DirectMessage> {
    return this.http.patch<DirectMessage>(`${environment.apiUrl}/direct-messages/${messageId}/read`, {});
  }

  markConversationAsRead(userId: number): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/direct-messages/conversation/${userId}/read`, {});
  }

  getAvailableRecipients(): Observable<UserRecipient[]> {
    return this.http.get<UserRecipient[]>(`${environment.apiUrl}/direct-messages/available-recipients`);
  }

  getConversationPartners(): Observable<UserRecipient[]> {
    return this.http.get<UserRecipient[]>(`${environment.apiUrl}/direct-messages/conversation-partners`);
  }

  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/direct-messages/${messageId}`);
  }
}
