import { Component, OnInit } from '@angular/core';
import { DirectMessageService, DirectMessage, UserRecipient, DirectMessageDto } from '../../services/direct-message.service';

@Component({
  selector: 'app-unified-messaging',
  templateUrl: './unified-messaging.component.html',
  styleUrls: ['./unified-messaging.component.css']
})
export class UnifiedMessagingComponent implements OnInit {
  showMessaging = false;
  activeTab: 'inbox' | 'compose' = 'inbox';

  // Inbox
  unreadCount = 0;
  conversationPartners: UserRecipient[] = [];
  selectedPartner: UserRecipient | null = null;
  conversationMessages: DirectMessage[] = [];

  // Compose
  availableRecipients: UserRecipient[] = [];
  selectedRecipient: number | null = null;
  messageContent = '';

  // Common
  loading = false;
  error = '';
  success = '';

  constructor(private messageService: DirectMessageService) { }

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  openMessaging(tab: 'inbox' | 'compose' = 'inbox'): void {
    this.showMessaging = true;
    this.activeTab = tab;
    this.error = '';
    this.success = '';

    if (tab === 'inbox') {
      this.loadConversationPartners();
    } else {
      this.loadAvailableRecipients();
    }
  }

  closeMessaging(): void {
    this.showMessaging = false;
    this.selectedPartner = null;
    this.conversationMessages = [];
    this.resetComposeForm();
  }

  switchTab(tab: 'inbox' | 'compose'): void {
    this.activeTab = tab;
    this.error = '';
    this.success = '';

    if (tab === 'inbox') {
      this.loadConversationPartners();
      this.selectedPartner = null;
      this.conversationMessages = [];
    } else {
      this.loadAvailableRecipients();
      this.resetComposeForm();
    }
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

  loadConversationPartners(): void {
    this.loading = true;
    this.messageService.getConversationPartners().subscribe({
      next: (partners) => {
        this.conversationPartners = partners;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading conversation partners:', err);
        this.error = 'Failed to load conversations';
        this.loading = false;
      }
    });
  }

  loadAvailableRecipients(): void {
    this.loading = true;
    this.messageService.getAvailableRecipients().subscribe({
      next: (recipients) => {
        this.availableRecipients = recipients;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipients:', err);
        this.error = 'Failed to load recipients';
        this.loading = false;
      }
    });
  }

  openConversation(partner: UserRecipient): void {
    this.selectedPartner = partner;
    this.loading = true;

    this.messageService.getConversation(partner.id).subscribe({
      next: (messages) => {
        this.conversationMessages = messages;
        this.loading = false;

        // Mark as read
        this.messageService.markConversationAsRead(partner.id).subscribe({
          next: () => {
            this.loadUnreadCount();
            this.conversationMessages.forEach(msg => {
              if (!msg.isRead && !this.isMessageFromMe(msg)) {
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
    this.loadConversationPartners();
  }

  replyToConversation(): void {
    if (!this.selectedPartner) return;

    // Switch to compose tab with recipient pre-selected
    this.activeTab = 'compose';
    this.selectedRecipient = this.selectedPartner.id;
    this.loadAvailableRecipients();
  }

  sendMessage(): void {
    if (!this.selectedRecipient) {
      this.error = 'Please select a recipient';
      return;
    }

    if (!this.messageContent.trim()) {
      this.error = 'Please enter a message';
      return;
    }

    if (this.messageContent.length > 2000) {
      this.error = 'Message cannot exceed 2000 characters';
      return;
    }

    this.loading = true;
    this.error = '';

    const dto: DirectMessageDto = {
      recipientId: this.selectedRecipient,
      content: this.messageContent.trim()
    };

    this.messageService.sendMessage(dto).subscribe({
      next: (message) => {
        this.success = 'Message sent successfully!';
        this.loading = false;
        this.resetComposeForm();

        setTimeout(() => {
          this.success = '';
          // Switch to inbox
          this.switchTab('inbox');
        }, 1500);
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.error = err.error?.message || 'Failed to send message';
        this.loading = false;
      }
    });
  }

  resetComposeForm(): void {
    this.selectedRecipient = null;
    this.messageContent = '';
    this.error = '';
    this.success = '';
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

  isMessageFromMe(message: DirectMessage): boolean {
    const currentUserId = this.getCurrentUserId();
    return message.sender.id === currentUserId;
  }

  getCurrentUserId(): number {
    // Get from auth service or local storage
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : 1;
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
