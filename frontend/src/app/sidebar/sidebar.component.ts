import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SideNavDirection } from './SidebarNavDirection';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  showFiller = false;

  constructor(private router: Router) {
   }

  ngOnInit(): void {
  }
  
  goToRequest() {
    this.router.navigateByUrl('/requestEmp');
  }

  goToRescueTeam() {
    this.router.navigateByUrl('/rescueTeam');
  }
  goToUser() {
    this.router.navigateByUrl('/user');
  }
  goToDepartments() {
    this.router.navigateByUrl('/departments');
  }
  goToChatLobby(){
    this.router.navigateByUrl('/chatLobb');
  }
}
