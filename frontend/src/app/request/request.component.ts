import { Component, OnInit , NgZone} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Request} from '../model/Request';
import {RequestForSending} from '../model/RequestForSending';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink} from '@angular/router';
import { trigger } from '@angular/animations';
//import { AuthenticationService } from '../services/authentication.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { VictimServicesService } from '../services/victim-services.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {


  isHidden=true;
  request: Request = new Request(0,false,false,false);
  invalid = true;
  requestForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    people: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
    fire: new FormControl(false),
    medical: new FormControl(false),
    crime: new FormControl(false),
    location: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
  });
  message="THIS IS MESSAGE";
 // username='user';
 // password='user';
  invalidLogin = false;
  chatService: any;

  constructor(private ngZone: NgZone,private localStorage: LocalStorageService,private vicService: VictimServicesService,private FormBuilder:FormBuilder, private http: HttpClient, private router : Router) {

  }

  ngOnInit(): void {
    //this.loginService.authenticate("user","user");
  }

  onSubmit(requestData:any){
    // Validate form before submission
    if (this.requestForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.requestForm.controls).forEach(key => {
        this.requestForm.get(key)?.markAsTouched();
      });
      console.error('Form is invalid');
      return;
    }

    // Validate at least one emergency type is selected
    if (!requestData.crime && !requestData.fire && !requestData.medical) {
      console.error('Please select at least one emergency type');
      return;
    }

    // Determine emergency type based on selections
    let emergencyType = 'RESCUE'; // Default

    if (requestData.crime && requestData.fire && requestData.medical) {
      emergencyType = 'RESCUE'; // Multiple emergencies
    } else if (requestData.crime && requestData.fire) {
      emergencyType = 'FIRE'; // Fire takes priority when with crime
    } else if (requestData.crime && requestData.medical) {
      emergencyType = 'MEDICAL'; // Medical with crime
    } else if (requestData.fire && requestData.medical) {
      emergencyType = 'FIRE'; // Fire takes priority
    } else if (requestData.crime) {
      emergencyType = 'CRIME';
    } else if (requestData.fire) {
      emergencyType = 'FIRE';
    } else if (requestData.medical) {
      emergencyType = 'MEDICAL';
    }

    // Determine priority (you can enhance this logic)
    const priority = (requestData.fire || requestData.medical) ? 'HIGH' : 'MEDIUM';

    const description = `People affected: ${requestData.people || 0}. ` +
                       (requestData.crime ? 'Crime reported. ' : '') +
                       (requestData.fire ? 'Fire emergency. ' : '') +
                       (requestData.medical ? 'Medical emergency. ' : '');

    var rSending = new RequestForSending(
      requestData.name,           // victimName
      '',                         // victimPhone (add field if needed)
      requestData.location,       // location
      0,                          // latitude (add if available)
      0,                          // longitude (add if available)
      emergencyType,              // emergencyType
      priority,                   // priority
      description                 // description
    );

    console.log('Sending emergency request:', rSending);
    this.vicService.addRequest(rSending).subscribe(
      (data:any)=>{
        console.log(data);
        this.localStorage.store('request',data);
        this.ngZone.run(() => this.router.navigateByUrl('requestLanding'))
      },
      (error)=>console.log(error)
    );

  }
  redirectToLobby() : void {
    this.router.navigate(['lobby']);
}
  returnData(response : any){
      if(response.id!=null){
          this.router.navigate(['/lobby',response.id]);
      }
     console.log(response.id);
  }


showRequestForm():void{
     // this.loginService.authenticate("user","user");
      if(this.isHidden==true){
          this.isHidden=false;
      }
      else{this.isHidden=true;}
}

  redirectToLogin() : void {
    this.router.navigate(['./login']);
}

sendMessage() {
  this.chatService.sendMessage(this.message);
  this.message = '';
}

getErrorMessage(fieldName: string): string {
  const control = this.requestForm.get(fieldName);
  if (control?.hasError('required')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }
  if (control?.hasError('minlength')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
  }
  if (control?.hasError('maxlength')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${control.errors?.['maxlength'].requiredLength} characters`;
  }
  if (control?.hasError('min')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['min'].min}`;
  }
  if (control?.hasError('max')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${control.errors?.['max'].max}`;
  }
  return '';
}
}

