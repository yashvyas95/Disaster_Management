import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService} from '../services/request.service';
import { RescueTeamService} from '../services/rescue-team.service';

@Component({
  selector: 'app-assign-rescue-team-dialog-admin',
  templateUrl: './assign-rescue-team-dialog-admin.component.html',
  styleUrls: ['./assign-rescue-team-dialog-admin.component.css']
})
export class AssignRescueTeamDialogAdminComponent implements OnInit {

  constructor(public rescueTeamService:RescueTeamService,public requestService:RequestService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  activeRequest:any;
  displayedColumns: string[] = ['request_id', 'name', 'location', 'nature','status','assign'];

  ngOnInit(): void {
    this.requestService.getAllActiveRequest().subscribe(
      (response)=>{
        this.activeRequest=response;
        console.log(response);
      }

    );
  }



  close(){
    this.dialog.closeAll();
  }

  assignRequest(requestId:any){
    console.log(requestId);
    console.log(this.data);
    this.rescueTeamService.assignRequest(requestId,this.data);
  }
}
