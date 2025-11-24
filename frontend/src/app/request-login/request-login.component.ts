import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-request-login',
  templateUrl: './request-login.component.html',
  styleUrls: ['./request-login.component.css']
})
export class RequestLoginComponent implements OnInit {

  requestForm: FormGroup;

  constructor(private localStorage: LocalStorageService,private httpClient : HttpClient,private router:Router) { 
    this.requestForm = new FormGroup({
      fullName: new FormControl(''),
      location: new FormControl('')
    });
  }


  ngOnInit(): void {
  }

  fetchRequest(){
    let params = new HttpParams().append('fullName',this.requestForm.get('fullName')!.value).append('location',this.requestForm.get('location')!.value);
    console.log(this.requestForm.get('location')!.value);
    console.log(params);
    this.httpClient.get('http://localhost:8080/api/request/victimLogin/',{params:params}).subscribe(
      (response)=>{
        console.log(response);
        this.localStorage.store('request',response);
        if(response!=null){
          this.router.navigate(['requestLanding']);
        }
        else{
          this.router.navigate(['requestLogin']);
        }
        
      }
    )
  
  }

}
