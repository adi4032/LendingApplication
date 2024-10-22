import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-scheme',
  templateUrl: './loan-scheme.component.html',
  styleUrl: './loan-scheme.component.css'
})
export class LoanSchemeComponent {

  retailLoans: any[] = [];
  corporateLoans: any[] = [];
 
  constructor(private http: HttpClient, private router:Router) { }
 
  ngOnInit(): void {
    this.getRetailLoans();
    this.getCorporateLoans();
  }
 
  // Fetch Retail Loans
  getRetailLoans(): void {
    this.http.get('http://localhost:5099/retail').subscribe(
      (data: any) => {
        this.retailLoans = data;
      },
      (error) => {
        console.error('Error fetching retail loans', error);
      }
    );
  }
 
  // Fetch Corporate Loans
  getCorporateLoans(): void {
    this.http.get('http://localhost:5099/corporate').subscribe(
      (data: any) => {
        this.corporateLoans = data;
      },
      (error) => {
        console.error('Error fetching corporate loans', error);
      }
    );
  }

  applyForLoan(loanSchemesId: number): void {
    // Redirect to the loan application form, passing the loanSchemesId as a query parameter
    this.router.navigate(['/apply-loan'], { queryParams: { loanSchemesId } });
  }

}
