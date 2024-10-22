import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html',
  styleUrl: './add-scheme.component.css'
})
export class AddSchemeComponent {
  loanScheme = {
    LSType: '',
    LSName: '',
    LSDescription: '',
    RateOfInterest: null,
    Tenure: null  // Add Tenure field here
  };
 
  private apiUrl = 'http://localhost:5099/api/LoanScheme'; // Your API endpoint
 
  constructor(private http: HttpClient, private router: Router) {}
 
  onSubmit(form: any) {
    if (form.valid) {
      this.postLoanScheme();
    } else {
      console.log('Form is invalid');
    }
  }
 
  postLoanScheme() {
    this.http.post(this.apiUrl, this.loanScheme)
      .subscribe({
        next: (response) => {
          console.log('Loan scheme added successfully!', response);
          alert("Loan Scheme Added Successfully!!");
          this.router.navigate(['/admin-dashboard']);  // Redirect after successful submission
        },
        error: (error) => {
          console.error('Error adding loan scheme', error);
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin-dashboard']);
  }
}
