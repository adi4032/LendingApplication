import { Component } from '@angular/core';
import { ApplyLoanApplicationService } from '../services/apply-loan-application.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apply-loan-application',
  templateUrl: './apply-loan-application.component.html',
  styleUrl: './apply-loan-application.component.css'
})
export class ApplyLoanApplicationComponent {
  loanApplication: any = {
    loanApplicationId: null, 
    loanOfficerId: 0,
    userId: null,
    loanSchemesId: null,
    amount: 0,
    accountNumber: '',
    status: 'pending',
    remark: 'test',
    personalDocsList: [], // Store File objects for personal docs
    collateralDocsList: [] // Store File objects for collateral docs
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private loanApplicationService: ApplyLoanApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get loan scheme ID from query params
    this.route.queryParams.subscribe(params => {
      this.loanApplication.loanSchemesId = params['loanSchemesId'];
    });

    // Get user ID from localStorage
    this.loanApplication.userId = localStorage.getItem('id');
  }

  // Handle personal document uploads
  onPersonalDocsUpload(event: any): void {
    const files = Array.from(event.target.files);
    this.loanApplication.personalDocsList.push(...files);  // Use spread operator to append multiple files
  }

  // Handle collateral document uploads
  onCollateralDocsUpload(event: any): void {
    const files = Array.from(event.target.files);
    this.loanApplication.collateralDocsList.push(...files);  // Use spread operator to append multiple files
  }

  // Submit loan application
  submitApplication(): void {
    const formData = new FormData();

    // Append loan application details
    formData.append('loanOfficerId', this.loanApplication.loanOfficerId.toString());
    formData.append('userId', this.loanApplication.userId);
    formData.append('loanSchemesId', this.loanApplication.loanSchemesId);
    formData.append('amountRequested', this.loanApplication.amount.toString());
    formData.append('accountNumber', this.loanApplication.accountNumber);
    formData.append('remarks', this.loanApplication.remark);
    formData.append('status', this.loanApplication.status);


    this.loanApplication.personalDocsList.forEach((file: File) => {
      formData.append('SubmittedPersonalDocuments', file, file.name);
    });

    if (this.loanApplication.collateralDocsList.length > 0) {
      this.loanApplication.collateralDocsList.forEach((file: File) => {
        formData.append('SubmittedCollateralDocuments', file, file.name);
      });
    }

    // Append application date
    formData.append('applicationDate', new Date().toISOString());

    // Submit the loan application via the service
    this.loanApplicationService.submitLoanApplication(formData).subscribe(
      response => {
        this.successMessage = 'Loan application submitted successfully!';
        this.errorMessage = null;
        // Optionally navigate to another page after successful submission
      },
      error => {
        console.error('Error Response:', error);
        this.errorMessage = 'Failed to submit loan application. Please try again later.';
        this.successMessage = null;
      }
    );
  }

  removePersonalDoc(index: number): void {
    this.loanApplication.personalDocsList.splice(index, 1);
  }
  
  removeCollateralDoc(index: number): void {
    this.loanApplication.collateralDocsList.splice(index, 1);
  }
  
  
  
}
