import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MessageToUserDialogComponent} from '../message-to-user-dialog/message-to-user-dialog.component';


@Component({
  selector: 'app-employes-info-dialog',
  templateUrl: './employes-info-dialog.component.html',
  styleUrls: ['./employes-info-dialog.component.css']
})
export class EmployesInfoDialogComponent implements OnInit {

  displayedColumns: string[] = ['Id','fullName' ,'rescueTeamID','action'];
  dataSource = new MatTableDataSource();

  constructor(private dialog : MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  Alluser:any
  ngOnInit(): void {
    
    this.Alluser=this.data;
    //console.log(this.RequestData.get(0)+"REQYEST");
    console.log(this.data),
    console.log(this.Alluser),
    this.dataSource.data=this.Alluser;

  }

  close(){
    this.dialog.closeAll();
  }

  messageToUserDialog(user:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = user;
      dialogConfig.autoFocus = true;
      dialogConfig.position={top:"100px",left:""};
      console.log("USEID::::::"+user)
      this.dialog.open(MessageToUserDialogComponent,dialogConfig)
      
    }
  
  

}
