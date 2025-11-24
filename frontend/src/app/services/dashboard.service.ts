import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeRequests: number;
  resolvedRequests: number;
  totalTeams: number;
  availableTeams: number;
  busyTeams: number;
  totalDepartments: number;
  requestsByStatus: { [key: string]: number };
  requestsByType: { [key: string]: number };
  requestsByPriority: { [key: string]: number };
  criticalRequests: number;
  highPriorityRequests: number;
  resolutionRate: number;
}

export interface EmergencyRequest {
  id: number;
  victimName: string;
  victimPhone: string;
  location: string;
  emergencyType: string;
  priority: string;
  status: string;
  description: string;
  createdAt: string;
  assignedTeam?: any;
}

export interface VictimDashboard {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  recentRequests: EmergencyRequest[];
}

export interface DepartmentDashboard {
  assignedRequests: number;
  completedRequests: number;
  pendingAssignments: number;
  teamUtilization: number;
  requests: EmergencyRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`);
  }

  getVictimDashboard(): Observable<VictimDashboard> {
    return this.http.get<VictimDashboard>(`${environment.apiUrl}/dashboard/victim`);
  }

  getDepartmentDashboard(): Observable<DepartmentDashboard> {
    return this.http.get<DepartmentDashboard>(`${environment.apiUrl}/dashboard/department`);
  }

  getRecentRequests(limit: number = 10): Observable<EmergencyRequest[]> {
    return this.http.get<EmergencyRequest[]>(`${environment.apiUrl}/requests/recent?limit=${limit}`);
  }
}
