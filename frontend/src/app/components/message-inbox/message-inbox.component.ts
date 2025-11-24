import { Component, OnInit, ViewChild } from '@angular/core';
import { DirectMessageService, DirectMessage, UserRecipient, DirectMessageDto } from '../../services/direct-message.service';
import { SendMessageDialogComponent } from '../send-message-dialog/send-message-dialog.component';

@Component({
  selector: 'app-message-inbox',
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.css']
})
export class MessageInboxComponent implements OnInit {
  @ViewChild(SendMessageDialogComponent) sendMessageDialog!: SendMessageDialogComponent;

  messages: DirectMessage[] = [];
  unreadCount: number = 0;
  conversationPartners: UserRecipient[] = [];
  selectedPartner: UserRecipient | null = null;
  conversationMessages: DirectMessage[] = [];
  loading = false;
  error = '';
  showInbox = false;

  constructor(private messageService: DirectMessageService) { }

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  openInbox(): void {
    this.showInbox = true;
    this.loadMessages();
    this.loadConversationPartners();
  }

  closeInbox(): void {
    this.showInbox = false;
    this.selectedPartner = null;
    this.conversationMessages = [];
  }

  loadUnreadCount(): void {
    this.messageService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Error loading unread count:', err);
      }
    });
  }

  loadMessages(): void {
    this.loading = true;
    this.error = '';

    this.messageService.getMyMessages(0, 50).subscribe({
      next: (data) => {
        this.messages = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.error = 'Failed to load messages';
        this.loading = false;
      }
    });
  }

  loadConversationPartners(): void {
    this.messageService.getConversationPartners().subscribe({
      next: (partners) => {
        this.conversationPartners = partners;
      },
      error: (err) => {
        console.error('Error loading conversation partners:', err);
      }
    });
  }

  openConversation(partner: UserRecipient): void {
    this.selectedPartner = partner;
    this.loading = true;
    this.error = '';

    this.messageService.getConversation(partner.id).subscribe({
      next: (messages) => {
        this.conversationMessages = messages;
        this.loading = false;

        // Mark conversation as read
        this.messageService.markConversationAsRead(partner.id).subscribe({
          next: () => {
            this.loadUnreadCount();
            // Update read status in local messages
            this.conversationMessages.forEach(msg => {
              if (!msg.isRead && msg.recipient.id !== partner.id) {
                msg.isRead = true;
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error loading conversation:', err);
        this.error = 'Failed to load conversation';
        this.loading = false;
      }
    });
  }

  backToList(): void {
    this.selectedPartner = null;
    this.conversationMessages = [];
    this.loadMessages();
    this.loadUnreadCount();
  }

  openReplyDialog(recipientId: number, recipientName: string): void {
    this.closeInbox();
    // Use the send message dialog component instead
    if (this.sendMessageDialog) {
      this.sendMessageDialog.openDialog();
      // Pre-select recipient after a small delay to ensure dialog is open
      setTimeout(() => {
        this.sendMessageDialog.selectedRecipient = recipientId;
      }, 100);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  getOtherUser(message: DirectMessage): any {
    return message.sender.id !== this.getCurrentUserId() ? message.sender : message.recipient;
  }

  getCurrentUserId(): number {
    // This should be retrieved from AuthService or local storage
    // For now, we'll use a placeholder
    return 1;
  }

  isMessageFromMe(message: DirectMessage): boolean {
    return message.sender.id === this.getCurrentUserId();
  }

  getRoleBadgeClass(role: string): string {
    const badges: { [key: string]: string } = {
      'ROLE_ADMIN': 'badge-danger',
      'ROLE_DEPARTMENT_HEAD': 'badge-primary',
      'ROLE_DISPATCHER': 'badge-info',
      'ROLE_RESCUE_TEAM_MEMBER': 'badge-warning',
      'ROLE_VICTIM': 'badge-secondary'
    };
    return badges[role] || 'badge-secondary';
  }

  getRoleDisplayName(role: string): string {
    const names: { [key: string]: string } = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_DEPARTMENT_HEAD': 'Department Head',
      'ROLE_DISPATCHER': 'Dispatcher',
      'ROLE_RESCUE_TEAM_MEMBER': 'Rescue Team',
      'ROLE_VICTIM': 'Victim'
    };
    return names[role] || role;
  }
}
