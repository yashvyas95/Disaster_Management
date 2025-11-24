import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { RequestForSending } from '../model/RequestForSending';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VictimServicesService {

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) { }

  getRequest(id: number): Observable<any>{
    const params = new HttpParams().append('id',id.toString());
    return this.httpClient.get(`${environment.apiUrl}/requests/${id}`);
  }

  addRequest(requestForSending: RequestForSending):Observable<Request>{
    var req = this.httpClient.post<Request>(`${environment.apiUrl}/requests/emergency`,
    requestForSending);
    this.localStorage.store('request',req);
    return req;
  }

}
