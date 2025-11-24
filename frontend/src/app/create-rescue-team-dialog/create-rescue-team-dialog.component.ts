import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RescueTeam} from '../model/RescueTeam';
import { RescueTeamService } from '../services/rescue-team.service';


@Component({
  selector: 'app-create-rescue-team-dialog',
  templateUrl: './create-rescue-team-dialog.component.html',
  styleUrls: ['./create-rescue-team-dialog.component.css']
})
export class CreateRescueTeamDialogComponent implements OnInit {
  rescueTeam: RescueTeam = new RescueTeam([],0,'','','');
  selectedValue:any;
  fire:any;
  crime:any;
  medical:any;
  SelectedEmployees=new FormControl();
  rescueTeamForm = new FormGroup({
    name:new FormControl(),
    selectedEmployee:new FormControl(),
    fire:new FormControl(),
    medical:new FormControl(),
    crime:new FormControl(),
    location:new FormControl(),
  })
  AllEmp:any;

  constructor(public rescueTeamservice : RescueTeamService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private FormBuilder:FormBuilder) { 
    this.AllEmp=this.data;
    console.log(this.AllEmp);
    
  }
  
  ngOnInit(): void {
    //cthis.AllEmp=this.data;
  }

  close(){
    this.dialog.closeAll();
  }

  createRescueTeam(rescueTeamData:any){
      let nature:any;
      if(rescueTeamData.crime){
        if(rescueTeamData.fire){
          if(rescueTeamData.medical){
            nature=6;
            }
            else{
              nature=3;
            }
        }
        else if(rescueTeamData.medical){
          nature=5;
        }
        else{
          nature=0;
        }
      }
      else if(rescueTeamData.fire){
          if(rescueTeamData.medical){
              nature=4;
          } 
          else{
            nature=1;
          }
      }
      else if(rescueTeamData.medical){
          nature=2;
      }
    console.log(nature);
    console.log(rescueTeamData);
    console.log(this.SelectedEmployees.value);
    this.rescueTeam.members=this.SelectedEmployees.value;
    this.rescueTeam.location=this.rescueTeamForm.value.location;
    console.log(this.rescueTeam);
    this.rescueTeam.nature=nature;

    this.rescueTeam.status="true";
    this.rescueTeamservice.createRescueTeam(this.rescueTeam);
  }

}
