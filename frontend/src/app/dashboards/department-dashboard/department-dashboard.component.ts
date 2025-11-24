import { Component, OnInit } from '@angular/core';
import { DashboardService, DepartmentDashboard, EmergencyRequest } from '../../services/dashboard.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-department-dashboard',
  templateUrl: './department-dashboard.component.html',
  styleUrl: './department-dashboard.component.css'
})
export class DepartmentDashboardComponent implements OnInit {
  dashboard: DepartmentDashboard | null = null;
  loading = true;
  error = '';
  selectedRequest: any = null;
  showDetailModal = false;

  constructor(
    private dashboardService: DashboardService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getDepartmentDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
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

  viewRequestDetail(request: any): void {
    this.selectedRequest = request;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRequest = null;
  }

  updateStatus(status: string): void {
    if (!this.selectedRequest) return;

    this.requestService.updateRequestStatus(this.selectedRequest.id, status).subscribe({
      next: (response) => {
        console.log('Status updated successfully:', response);
        this.closeDetailModal();
        this.loadDashboard();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.error = 'Failed to update status. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  completeRequest(notes: string = 'Request completed'): void {
    if (!this.selectedRequest) return;

    this.requestService.updateRequestStatus(this.selectedRequest.id, 'RESOLVED').subscribe({
      next: () => {
        this.requestService.addResolutionNotes(this.selectedRequest.id, notes).subscribe({
          next: (response) => {
            console.log('Request completed:', response);
            this.closeDetailModal();
            this.loadDashboard();
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
}
