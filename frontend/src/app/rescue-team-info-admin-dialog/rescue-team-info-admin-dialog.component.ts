import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AssignRescueTeamDialogAdminComponent } from '../assign-rescue-team-dialog-admin/assign-rescue-team-dialog-admin.component';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-rescue-team-info-admin-dialog',
  templateUrl: './rescue-team-info-admin-dialog.component.html',
  styleUrls: ['./rescue-team-info-admin-dialog.component.css']
})
export class RescueTeamInfoAdminDialogComponent implements OnInit {

  displayedColumns: string[] = ['Id','request_id' ,'location', 'Members','nature','status','action','action2'];
  dataSource = new MatTableDataSource();

  constructor(private requestService:RequestService,private dialog : MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  RequestData:any

  activeRequest:any;

  ngOnInit(): void {  
    this.RequestData=this.data;
    //console.log(this.RequestData.get(0)+"REQYEST");
    console.log(this.data),
    console.log(this.RequestData),
    this.dataSource.data=this.RequestData;
    this.activeRequest=this.requestService.getAllActiveRequest().subscribe(
      (response)=>{
        this.activeRequest=response;
        console.log(response);
      }
      
    );
  }

  close(){
    this.dialog.closeAll();
  }
  
  openAssignDialog(rescueTeamId:any){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;

      dialogConfig.data = rescueTeamId;
      dialogConfig.autoFocus = true;
      console.log("HERE"+JSON.stringify(this.activeRequest));
      this.dialog.open(AssignRescueTeamDialogAdminComponent,dialogConfig);
      
  }
  
}
