import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from '../model/Department';

@Component({
  selector: 'app-create-department-admin',
  templateUrl: './create-department-admin.component.html',
  styleUrls: ['./create-department-admin.component.css']
})
export class CreateDepartmentAdminComponent implements OnInit {
  depObj: Department = new Department([],'','','');
  allemp:any
  user:any;
  SelectedEmployees=new FormControl();
  departmentForm=new FormGroup({
    name:new FormControl(),
    location:new FormControl(),
  });


  constructor(public httpClient:HttpClient,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:FormBuilder) { 
      this.allemp=data;
  }

  ngOnInit(): void {
  }

  close(){
    this.dialog.closeAll();
  }

  createDepartment(departmentData:any){
      console.log(departmentData);
      console.log(this.SelectedEmployees.value);
      this.depObj.employees=this.SelectedEmployees.value;
      this.depObj.name=departmentData.name;
      this.depObj.location=departmentData.location;
      console.log("DEpartment Creation"+departmentData);
      departmentData.selectedEmployee=this.SelectedEmployees.value;
      return this.httpClient.post('http://localhost:8080/api/department/addDepartment/',this.depObj,{ responseType: 'text' }).subscribe();
  }
}
