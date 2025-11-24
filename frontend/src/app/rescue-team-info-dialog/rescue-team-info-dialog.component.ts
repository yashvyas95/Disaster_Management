import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-rescue-team-info-dialog',
  templateUrl: './rescue-team-info-dialog.component.html',
  styleUrls: ['./rescue-team-info-dialog.component.css']
})
export class RescueTeamInfoDialogComponent implements OnInit {

  displayedColumns: string[] = ['Id','request_id' ,'location', 'members','status','action'];
  dataSource = new MatTableDataSource();

  constructor(private dialog : MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  RequestData:any
  ngOnInit(): void {
    
    this.RequestData=this.data;
    //console.log(this.RequestData.get(0)+"REQYEST");
    console.log(this.data),
    console.log(this.RequestData),
    this.dataSource.data=this.RequestData;

  }

  close(){
    this.dialog.closeAll();
  }


}
