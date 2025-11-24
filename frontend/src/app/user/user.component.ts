import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup , FormBuilder } from '@angular/forms';
import { User } from '../model/User';
import { Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User = new User();
  
  userForm = new FormGroup({
      email:new FormControl(),
      password:new FormControl(),
      department:new FormControl(),
      role:new FormControl(),
  })


  constructor(private FormBuilder:FormBuilder, private http: HttpClient,private router : Router) { 
    
  }

  ngOnInit(): void {
  }



  onSubmit(userData:any){
    console.log("IN onSubmit method");
    console.log(userData.email);
    console.log(userData.password);
    this.http.post('http://localhost:8080/adduser/${userData.email}', userData).subscribe(
    (response) => this.reDirect(),
    (error) => console.log(error))
  }

  reDirect() : void {
      this.router.navigate([`./fire-department.component.html`]);
  }

  reDirectToLogin():void{
    this.router.navigate([`login`]);
  }

}

