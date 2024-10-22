import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    recaptchaResponse: string = '';
    isLoading: boolean = false; // To manage loading state
    errorMessage: string = ''; // To store error messages
    showPassword: boolean = false;
  
    constructor(private authService: AuthService, private router: Router) {}
  
    onRecaptchaResolved(captchaResponse: string | null) {
      this.recaptchaResponse = captchaResponse || '';
    }
  
    onSubmit(form: NgForm) {
      this.errorMessage = ''; // Clear previous errors
      if (form.valid && this.recaptchaResponse) {
        this.isLoading = true; // Set loading state
        this.authService.login(this.username, this.password, this.recaptchaResponse)
          .subscribe((response: any) => {
            this.isLoading = false; // Reset loading state
            this.authService.setToken(response.token);
            const tokenPayload = this.authService.decodeToken(response.token);
            localStorage.setItem('id', response.userId);
            
            // Check if tokenPayload is not null
            if (tokenPayload) {
              if (tokenPayload.role === 'admin') {
                this.router.navigate(['/admin-dashboard']);
              } else if (tokenPayload.role === 'loanOfficer') {
                this.router.navigate(['/loan-officer-main-dashboard']);
              } else {
                this.router.navigate(['/user']);
                console.log('Navigating to role:', tokenPayload.role);
              }
            } else {
              console.error('Invalid token payload');
              this.errorMessage = 'Invalid login response. Please try again.';
            }
          }, (error) => {
            this.isLoading = false; // Reset loading state
            console.error('Login failed', error);
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
          });
      } else {
        if (!this.recaptchaResponse) {
          this.errorMessage = 'Please complete the reCAPTCHA.';
        } else {
          this.errorMessage = 'Please fill in all required fields.';
        }
      }
    }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
