import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  allemp:any;
  constructor(private departmentService:DepartmentService,private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.allemp=data;
  }
  allDep:any;
  displayedColumns=['department_id','name','employees','location','status'];
  ngOnInit(): void {
    console.log(this.allemp);
    this.departmentService.getAllDepartments().subscribe(
      (response)=>{
        console.log(response);
        this.allDep=response;
        console.log(this.allDep)
      }
    );
   
  }

  


  close(){
    this.dialog.closeAll();
  }
}
