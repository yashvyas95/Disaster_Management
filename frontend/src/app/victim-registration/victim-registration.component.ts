import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-victim-registration',
  templateUrl: './victim-registration.component.html',
  styleUrls: ['./victim-registration.component.css']
})
export class VictimRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
      ]],
      confirmPassword: ['', Validators.required],
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[+]?[0-9]{10,15}$/)
      ]],
      address: ['', Validators.maxLength(255)],
      city: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(50)],
      postalCode: ['', Validators.pattern(/^[0-9]{5,10}$/)],
      emergencyContactName: ['', Validators.maxLength(100)],
      emergencyContactPhone: ['', Validators.pattern(/^[+]?[0-9]{10,15}$/)]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      // Remove confirmPassword before sending to backend
      const formData = { ...this.registrationForm.value };
      delete formData.confirmPassword;

      this.authService.registerVictim(formData).subscribe({
        next: (response) => {
          this.toastr.success('Registration successful! Redirecting to dashboard...', 'Success');
          
          // Store authentication data
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', response.role);
          
          // Redirect to victim dashboard
          setTimeout(() => {
            this.router.navigate(['/victim-dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          if (error.status === 409) {
            this.toastr.error('Username or email already exists', 'Registration Failed');
          } else if (error.error && error.error.message) {
            this.toastr.error(error.error.message, 'Registration Failed');
          } else {
            this.toastr.error('An error occurred during registration', 'Registration Failed');
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registrationForm);
      this.toastr.warning('Please fill in all required fields correctly', 'Validation Error');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for template
  hasError(field: string, error: string): boolean {
    const control = this.registrationForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.registrationForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return this.getPatternErrorMessage(field);
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      city: 'City',
      state: 'State',
      postalCode: 'Postal Code',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone'
    };
    return labels[field] || field;
  }

  private getPatternErrorMessage(field: string): string {
    switch (field) {
      case 'username':
        return 'Username can only contain letters, numbers, underscores, and hyphens';
      case 'password':
        return 'Password must contain at least one uppercase, one lowercase, one digit, and one special character';
      case 'phoneNumber':
      case 'emergencyContactPhone':
        return 'Invalid phone number format (10-15 digits)';
      case 'postalCode':
        return 'Invalid postal code (5-10 digits)';
      default:
        return 'Invalid format';
    }
  }
}
