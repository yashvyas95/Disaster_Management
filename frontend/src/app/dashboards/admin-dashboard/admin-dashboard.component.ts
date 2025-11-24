import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DashboardService, DashboardStats, EmergencyRequest } from '../../services/dashboard.service';
import { RequestService } from '../../services/request.service';
import { RescueTeamService } from '../../services/rescue-team.service';
import { NotificationService } from '../../services/notification.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  allRequests: any[] = [];
  allTeams: any[] = [];
  loading = true;
  error = '';
  selectedRequest: any = null;
  showActionDialog = false;
  activeTab: string = 'status';
  resolutionNotes: string = '';
  cancellationReason: string = '';
  openDropdownId: number | null = null;

  // WebSocket subscriptions
  private subscriptions: Subscription[] = [];

  // Charts
  statusChart: any;
  priorityChart: any;
  teamChart: any;

  constructor(
    private dashboardService: DashboardService,
    private requestService: RequestService,
    private teamService: RescueTeamService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAllRequests();
    this.loadTeams();
    this.setupWebSocket();
  }

  setupWebSocket(): void {
    // Connect to WebSocket
    this.notificationService.connect();

    // Subscribe to new emergency requests
    this.subscriptions.push(
      this.notificationService.newRequests$.subscribe(notification => {
        if (notification) {
          console.log('🚨 New emergency request received via WebSocket:', notification);
          // Show browser notification if permitted
          this.showBrowserNotification('New Emergency Request',
            `${notification.victimName} needs help at ${notification.location}`);
          // Reload requests to show new one
          this.loadAllRequests();
          this.loadDashboardData();
        }
      })
    );

    // Subscribe to status updates
    this.subscriptions.push(
      this.notificationService.statusUpdates$.subscribe(notification => {
        if (notification) {
          console.log('📋 Status update received via WebSocket:', notification);
          // Update the specific request in the list
          const index = this.allRequests.findIndex(r => r.id === notification.id);
          if (index !== -1) {
            this.allRequests[index] = { ...this.allRequests[index], ...notification };
          }
          this.loadDashboardData(); // Refresh stats
        }
      })
    );
  }

  showBrowserNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/assets/logo.png' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/assets/logo.png' });
        }
      });
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getAdminStats().subscribe({
      next: (data) => {
        console.log('Dashboard stats loaded:', data);
        this.stats = data;
        this.loading = false;
        setTimeout(() => this.initializeCharts(), 100);
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        console.error('Error details:', err.error);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  loadAllRequests(): void {
    this.requestService.getAllActiveRequest().subscribe({
      next: (data) => {
        console.log('Requests loaded:', data);
        if (data && data.content) {
          // Sort by created date descending (newest first)
          this.allRequests = data.content.sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          console.log('Total requests:', this.allRequests.length);
        } else {
          console.warn('No content in requests response:', data);
          this.allRequests = [];
        }
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        console.error('Error details:', err.error);
        this.allRequests = [];
      }
    });
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.allTeams = teams;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
      }
    });
  }

  openActionDialog(request: any): void {
    this.selectedRequest = request;
    this.showActionDialog = true;
    this.activeTab = 'status';
    this.resolutionNotes = '';
    this.cancellationReason = '';
  }

  closeActionDialog(): void {
    this.showActionDialog = false;
    this.selectedRequest = null;
    this.activeTab = 'status';
    this.resolutionNotes = '';
    this.cancellationReason = '';
  }

  canUpdateStatus(): boolean {
    if (!this.selectedRequest) return false;
    if (!this.selectedRequest.assignedTeam && this.selectedRequest.status === 'PENDING') return false;
    return this.selectedRequest.status !== 'RESOLVED' && this.selectedRequest.status !== 'CANCELLED';
  }

  assignTeamToRequest(teamId: number): void {
    if (!this.selectedRequest) return;

    this.teamService.assignRequest(this.selectedRequest.id, teamId).subscribe({
      next: (response) => {
        console.log('Team assigned successfully:', response);
        this.closeActionDialog();
        // Reload data immediately
        this.loadAllRequests();
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error assigning team:', err);
        this.error = 'Failed to assign team. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  updateRequestStatus(requestId: number, newStatus: string): void {
    this.requestService.updateRequestStatus(requestId, newStatus).subscribe({
      next: (response) => {
        console.log('Status updated successfully:', response);
        this.closeActionDialog();
        this.loadAllRequests();
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.error = 'Failed to update status. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  completeRequestWithNotes(): void {
    if (!this.selectedRequest) return;

    // Validation
    if (this.selectedRequest.status === 'PENDING') {
      alert('Please assign a team before completing the request.');
      return;
    }

    if (this.selectedRequest.status === 'RESOLVED' || this.selectedRequest.status === 'CANCELLED') {
      alert('This request is already ' + this.selectedRequest.status.toLowerCase());
      return;
    }

    const notes = this.resolutionNotes.trim() || 'Request completed successfully';

    if (confirm(`Complete this request with notes: "${notes}"?`)) {
      // First update status to RESOLVED
      this.requestService.updateRequestStatus(this.selectedRequest.id, 'RESOLVED').subscribe({
        next: () => {
          // Then add resolution notes
          this.requestService.addResolutionNotes(this.selectedRequest.id, notes).subscribe({
            next: (response) => {
              console.log('Request completed:', response);
              alert('Request completed successfully!');
              this.resolutionNotes = '';
              this.closeActionDialog();
              this.loadAllRequests();
              this.loadDashboardData();
            },
            error: (err) => {
              console.error('Error adding notes:', err);
              alert('Request status updated but failed to save notes.');
              this.closeActionDialog();
              this.loadAllRequests();
            }
          });
        },
        error: (err) => {
          console.error('Error completing request:', err);
          this.error = 'Failed to complete request. Please try again.';
          alert('Failed to complete request: ' + (err.error?.message || 'Unknown error'));
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  cancelRequestWithReason(): void {
    if (!this.selectedRequest) return;

    // Validation
    if (this.selectedRequest.status === 'RESOLVED' || this.selectedRequest.status === 'CANCELLED') {
      alert('Cannot cancel a ' + this.selectedRequest.status.toLowerCase() + ' request.');
      return;
    }

    const reason = this.cancellationReason.trim() || 'Request cancelled by admin';

    if (confirm(`Cancel this request? Reason: "${reason}". This action cannot be undone.`)) {
      this.requestService.updateRequestStatus(this.selectedRequest.id, 'CANCELLED').subscribe({
        next: () => {
          // Add cancellation reason as a note
          this.requestService.addResolutionNotes(this.selectedRequest.id, `CANCELLED: ${reason}`).subscribe({
            next: (response) => {
              console.log('Request cancelled:', response);
              alert('Request cancelled successfully.');
              this.cancellationReason = '';
              this.closeActionDialog();
              this.loadAllRequests();
              this.loadDashboardData();
            },
            error: (err) => {
              console.error('Error adding cancellation note:', err);
              alert('Request cancelled but failed to save reason.');
              this.closeActionDialog();
              this.loadAllRequests();
            }
          });
        },
        error: (err) => {
          console.error('Error cancelling request:', err);
          this.error = 'Failed to cancel request. Please try again.';
          alert('Failed to cancel request: ' + (err.error?.message || 'Unknown error'));
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  completeRequest(requestId: number, notes: string = 'Request completed'): void {
    // First update status to RESOLVED
    this.requestService.updateRequestStatus(requestId, 'RESOLVED').subscribe({
      next: () => {
        // Then add resolution notes
        this.requestService.addResolutionNotes(requestId, notes).subscribe({
          next: (response) => {
            console.log('Request completed:', response);
            this.loadAllRequests();
            this.loadDashboardData();
          },
          error: (err) => {
            console.error('Error adding notes:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error completing request:', err);
        this.error = 'Failed to complete request. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  initializeCharts(): void {
    if (!this.stats) {
      console.warn('Stats data not available, skipping chart initialization');
      return;
    }

    if (!this.stats.requestsByStatus) {
      console.warn('Incomplete stats data, skipping chart initialization');
      return;
    }

    // Status Chart
    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (statusCtx) {
      this.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.stats.requestsByStatus),
          datasets: [{
            data: Object.values(this.stats.requestsByStatus),
            backgroundColor: [
              '#d4a859', '#6ba3c4', '#2c5f8d', '#5a9f7b', '#4a7ba7', '#c9504d'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Requests by Status' }
          }
        }
      });
    }

    // Priority Chart
    const priorityCtx = document.getElementById('priorityChart') as HTMLCanvasElement;
    if (priorityCtx && this.stats.requestsByPriority) {
      this.priorityChart = new Chart(priorityCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.stats.requestsByPriority),
          datasets: [{
            label: 'Requests',
            data: Object.values(this.stats.requestsByPriority),
            backgroundColor: ['#5a9f7b', '#6ba3c4', '#d4a859', '#c9504d']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Requests by Priority' }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    // Team Chart
    const teamCtx = document.getElementById('teamChart') as HTMLCanvasElement;
    if (teamCtx) {
      this.teamChart = new Chart(teamCtx, {
        type: 'pie',
        data: {
          labels: ['Available Teams', 'Busy Teams'],
          datasets: [{
            data: [this.stats.availableTeams, this.stats.busyTeams],
            backgroundColor: ['#5a9f7b', '#c9504d']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Team Availability' }
          }
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'PENDING': 'badge-warning', 'ASSIGNED': 'badge-info',
      'EN_ROUTE': 'badge-primary', 'ON_SCENE': 'badge-secondary',
      'RESOLVED': 'badge-success', 'CANCELLED': 'badge-danger'
    };
    return classes[status] || 'badge-secondary';
  }

  getPriorityBadgeClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'LOW': 'badge-success', 'MEDIUM': 'badge-info',
      'HIGH': 'badge-warning', 'CRITICAL': 'badge-danger'
    };
    return classes[priority] || 'badge-secondary';
  }

  ngOnDestroy(): void {
    if (this.statusChart) this.statusChart.destroy();
    if (this.priorityChart) this.priorityChart.destroy();
    if (this.teamChart) this.teamChart.destroy();

    // Unsubscribe from WebSocket notifications
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.notificationService.disconnect();
  }
}
