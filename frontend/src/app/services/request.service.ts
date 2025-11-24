import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient : HttpClient) { }

  getRequest(id: number): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/requests/${id}`);
  }

  completeRequest(id:string): Observable<any>{
    return this.httpClient.patch(`${environment.apiUrl}/requests/${id}/status?status=RESOLVED`, {});
  }

  getAllActiveRequest():Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/requests/active?size=100`);
  }

  getUserActiveRequest(id:string){
    const params = new HttpParams().append('id',id);
    return this.httpClient.get(`${environment.apiUrl}/requests/team/${id}`, { params: params });
  }

  updateRequestStatus(requestId: number, status: string): Observable<any> {
    const params = new HttpParams().append('status', status);
    return this.httpClient.patch(`${environment.apiUrl}/requests/${requestId}/status`, {}, { params });
  }

  addResolutionNotes(requestId: number, notes: string): Observable<any> {
    const params = new HttpParams().append('notes', notes);
    return this.httpClient.patch(`${environment.apiUrl}/requests/${requestId}/notes`, {}, { params });
  }

}
