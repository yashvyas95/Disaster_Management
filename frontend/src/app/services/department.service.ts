import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private httpClient: HttpClient) { }


  createDepartment(Dep:any){
    console.log(Dep);
    console.log("DepartmentService SERVICE"+Dep);
    return this.httpClient.post(`${environment.apiUrl}/departments`,Dep,{ responseType: 'text' }).subscribe();
  }

  getAllDepartments():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/departments`);
  }

}
