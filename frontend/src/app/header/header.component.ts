import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //faUser = faUser;
  isLoggedIn: boolean | undefined;
  username: string | undefined;
  user: any;
  userRole: string | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
  }


  goToUserProfile() {
    this.router.navigateByUrl('/user-profile/' + this.username);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }

  goHome() {
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Get current user's role from local storage
    const userRole = localStorage.getItem('role');

    if (userRole) {
      // Navigate based on role
      if (userRole === 'ROLE_ADMIN') {
        this.router.navigateByUrl('/admin/dashboard');
      } else if (userRole === 'ROLE_VICTIM') {
        this.router.navigateByUrl('/victim/dashboard');
      } else if (userRole === 'ROLE_DEPARTMENT_HEAD' || userRole === 'ROLE_DISPATCHER' || userRole === 'ROLE_RESCUE_TEAM_MEMBER') {
        this.router.navigateByUrl('/department/dashboard');
      } else {
        this.router.navigateByUrl('/home');
      }
    } else {
      // Fallback: try to get user info
      if (this.username) {
        this.authService.getUser(this.username).subscribe(
          (response: any) => {
            this.user = response;
            const role = response.role;

            if (role === 'ROLE_ADMIN') {
              this.router.navigateByUrl('/admin/dashboard');
            } else if (role === 'ROLE_VICTIM') {
              this.router.navigateByUrl('/victim/dashboard');
            } else if (role === 'ROLE_DEPARTMENT_HEAD' || role === 'ROLE_DISPATCHER' || role === 'ROLE_RESCUE_TEAM_MEMBER') {
              this.router.navigateByUrl('/department/dashboard');
            } else {
              this.router.navigateByUrl('/home');
            }
          },
          (error) => {
            console.error('Error getting user info:', error);
            this.router.navigateByUrl('/login');
          }
        );
      } else {
        this.router.navigateByUrl('/login');
      }
    }
  }
}
