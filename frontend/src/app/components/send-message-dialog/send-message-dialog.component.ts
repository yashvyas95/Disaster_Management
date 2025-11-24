import { Component, OnInit } from '@angular/core';
import { DirectMessageService, UserRecipient, DirectMessageDto } from '../../services/direct-message.service';

@Component({
  selector: 'app-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.css']
})
export class SendMessageDialogComponent implements OnInit {
  availableRecipients: UserRecipient[] = [];
  selectedRecipient: number | null = null;
  messageContent: string = '';
  loading = false;
  error = '';
  success = '';
  showDialog = false;

  constructor(private messageService: DirectMessageService) { }

  ngOnInit(): void {
    this.loadRecipients();
  }

  openDialog(): void {
    this.showDialog = true;
    this.resetForm();
    this.loadRecipients();
  }

  closeDialog(): void {
    this.showDialog = false;
    this.resetForm();
  }

  loadRecipients(): void {
    this.messageService.getAvailableRecipients().subscribe({
      next: (recipients) => {
        this.availableRecipients = recipients;
      },
      error: (err) => {
        console.error('Error loading recipients:', err);
        this.error = 'Failed to load available recipients';
      }
    });
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
    this.success = '';

    const dto: DirectMessageDto = {
      recipientId: this.selectedRecipient,
      content: this.messageContent.trim()
    };

    this.messageService.sendMessage(dto).subscribe({
      next: (message) => {
        this.success = 'Message sent successfully!';
        this.loading = false;
        setTimeout(() => {
          this.closeDialog();
        }, 1500);
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.error = err.error?.message || 'Failed to send message';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.selectedRecipient = null;
    this.messageContent = '';
    this.error = '';
    this.success = '';
  }

  getRecipientRoleBadge(role: string): string {
    const badges: { [key: string]: string } = {
      'ROLE_ADMIN': 'badge-danger',
      'ROLE_DEPARTMENT_HEAD': 'badge-primary',
      'ROLE_DISPATCHER': 'badge-info',
      'ROLE_RESCUE_TEAM': 'badge-warning',
      'ROLE_VICTIM': 'badge-secondary'
    };
    return badges[role] || 'badge-secondary';
  }

  getRoleDisplayName(role: string): string {
    const names: { [key: string]: string } = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_DEPARTMENT_HEAD': 'Department Head',
      'ROLE_DISPATCHER': 'Dispatcher',
      'ROLE_RESCUE_TEAM': 'Rescue Team',
      'ROLE_VICTIM': 'Victim'
    };
    return names[role] || role;
  }
}
