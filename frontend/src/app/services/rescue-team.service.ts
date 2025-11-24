import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RescueTeam } from '../model/RescueTeam';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RescueTeamService {

  constructor(private httpClient: HttpClient) { }
  x:any;
  getRescueTeam(id: string):Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/teams/${id}`);
  }
/*
  getmembers(id:number):Observable<any>{
    const params = new HttpParams().append('id',id.toString());
    return this.httpClient.get('http://localhost:8080/api').subscribe();
  }
*/

  createRescueTeam(resTeam:any){
    console.log(resTeam);
    console.log("RESCUETEAM SERVICE"+resTeam);
    return this.httpClient.post(`${environment.apiUrl}/teams`,resTeam,{ responseType: 'text' }).subscribe();
  }


  assignRequest(requestId:any,rescueTeamId:any): Observable<any>{
    const params = new HttpParams().append('teamId', rescueTeamId);
    return this.httpClient.patch(`${environment.apiUrl}/requests/${requestId}/assign`, {}, { params: params });
  }

  getRequestFromRequestId(id:string):Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/requests/team/${id}`);
  }

  getTeamsByDepartment(departmentId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/teams/department/${departmentId}`);
  }

  getAllTeams(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/teams`);
  }

}

