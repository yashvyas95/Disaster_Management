import { Component, OnInit } from '@angular/core';
import { DashboardService, VictimDashboard, EmergencyRequest } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-victim-dashboard',
  templateUrl: './victim-dashboard.component.html',
  styleUrl: './victim-dashboard.component.css'
})
export class VictimDashboardComponent implements OnInit {
  dashboard: VictimDashboard | null = null;
  loading = true;
  error = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getVictimDashboard().subscribe({
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

  createNewRequest(): void {
    this.router.navigate(['/victim/new-request']);
  }

  viewRequest(requestId: number): void {
    this.router.navigate(['/victim/request', requestId]);
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
}
