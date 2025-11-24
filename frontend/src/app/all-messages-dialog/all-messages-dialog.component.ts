import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-all-messages-dialog',
  templateUrl: './all-messages-dialog.component.html',
  styleUrls: ['./all-messages-dialog.component.css']
})
export class AllMessagesDialogComponent implements OnInit {

  messages:any=[];
  constructor(public dialog : MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { 

  }
  displayedColumns=['sender','content','timestamp'];
  ngOnInit(): void {
    console.log(this.data);
    this.messages=this.data;
  }

  close(){
      this.dialog.closeAll();
  }

  
  
}
