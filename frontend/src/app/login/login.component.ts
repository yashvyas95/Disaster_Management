import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request.payload';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
// REMOVED: import { AssertNotNull } from '@angular/compiler';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage='';
  isError=false;
  hidePassword = true;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private localStorage: LocalStorageService) {
    this.loginRequestPayload = {
      username: '',
      password: ''
    };
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {


    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['registered'] !== undefined && params['registered'] === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username')!.value;
    this.loginRequestPayload.password = this.loginForm.get('password')!.value;
    let errorData:any
    this.authService.login(this.loginRequestPayload).subscribe(
      (response)=>{
          if(response){
            const userRole = this.localStorage.retrieve('role');
            console.log('Login successful. User role:', userRole);

            // Route based on role to new dashboards
            if(userRole === 'ROLE_ADMIN'){
              console.log("Routing to admin dashboard");
              this.router.navigate(['/admin/dashboard']);
            }
            else if(userRole === 'ROLE_VICTIM'){
              console.log("Routing to victim dashboard");
              this.router.navigate(['/victim/dashboard']);
            }
            else if(userRole === 'ROLE_DEPARTMENT_HEAD' || userRole === 'ROLE_DISPATCHER' || userRole === 'ROLE_RESCUE_TEAM_MEMBER'){
              console.log("Routing to department dashboard");
              this.router.navigate(['/department/dashboard']);
            }
            else{
              console.log("Routing to default home");
              this.router.navigate(['/home']);
            }

            this.toastr.success('Login successful!', 'Welcome');
          }
          else{
            this.isError = true;
            console.log("LOGIN ERROR");
            this.toastr.error('Login failed. Please try again.', 'Error');
            throwError(errorData);
            this.router.navigateByUrl('/login');
          }
      },
      (error)=>{
        errorData = error;
        this.isError = true;
        console.error('Login error:', error);
        this.toastr.error('Invalid username or password', 'Login Failed');
      }
    );

  }

}
