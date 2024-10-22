import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'] // Fix styleUrl to styleUrls
})
export class RegistrationComponent {
  formData = {
    name: '',
    email: '',
    age: '',
    password: '',
    username: ''
  };

  recaptchaResponse: string = '';
  successMessage: string | null = null; // Add success message property

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  // Handle reCAPTCHA response
  onRecaptchaResolved(captchaResponse: string | null) {
    this.recaptchaResponse = captchaResponse || '';
  }

  // Handle form submission
  onSubmit(form: any): void {
    if (form.valid && this.recaptchaResponse) {
      // Prepare the request data to be sent
      const requestData = {
        fullName: this.formData.name,       // Name from the form
        age: this.formData.age,             // Age from the form
        userName: this.formData.username,   // Username from the form
        password: this.formData.password,   // Password from the form
        userEmail: this.formData.email,     // Email from the form
        recaptcha: this.recaptchaResponse    // Add the reCAPTCHA response
      };

      // Send the data to the backend via the authService
      this.authService.registerUser(
        requestData.fullName,
        requestData.age,
        requestData.userName,
        requestData.password,
        requestData.userEmail
      ).subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registration successful!'; // Set success message
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to login page after 2 seconds
          }, 2000);
        },
        (error: any) => {
          console.error('Registration failed:', error);
          // Handle error, e.g., show an error message
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['']);  // Navigate to landing-page
  }
}
