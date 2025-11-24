import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {RequestService} from '../services/request.service';
import {MessageToVictimComponent} from '../message-to-victim/message-to-victim.component';
// Removed invalid Angular compiler import for Angular 18
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-rescue-team-dialog',
  templateUrl: './rescue-team-dialog.component.html',
  styleUrls: ['./rescue-team-dialog.component.css']
})
export class RescueTeamDialogComponent implements OnInit {
  displayedColumns: string[] = ['request_id', 'name', 'location' ,'resTeamObj','nature','status','action','message'];
  dataSource = new MatTableDataSource();

  constructor(private dialog : MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private requestService : RequestService) { }
  RequestData:any;
  private updateSubscription!: Subscription;
  ngOnInit(): void {

    this.RequestData=this.data;
    //console.log(this.RequestData.get(0)+"REQYEST");
    console.log(this.data),
    console.log(this.RequestData),
    this.dataSource.data=this.RequestData;
    this.updateSubscription = interval(1000).subscribe(
      (val) => {
        this.RequestData=this.data;
    });
  }
  completeRequest(request_id:any){
      let data ;
       this.requestService.completeRequest(request_id).subscribe(
        (response)=>{
          console.log(response),
          data=response
        },
        (error)=>console.log(error)
      );
      return data;
  }

  close(){
    this.dialog.closeAll();
  }

  messageDialog(request_id:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = request_id;
    dialogConfig.autoFocus = true;
    dialogConfig.position={top:"100px",left:""};
    this.dialog.open(MessageToVictimComponent,dialogConfig);


  }

}
