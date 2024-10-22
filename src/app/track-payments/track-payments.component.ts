import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-track-payments',
  templateUrl: './track-payments.component.html',
  styleUrl: './track-payments.component.css'
})
export class TrackPaymentsComponent implements OnInit {
  applicationId: any | null = null;
  repayments: any[] = [];  // Array to store repayment details
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private applicationService: ApplicationService
  ) { }

  
  
  ngOnInit(): void {
    // Get the application ID from the route
    this.applicationId = Number(this.route.snapshot.paramMap.get('applicationId'));
    console.log("Repayment Application Id: ",this.applicationId);
    
    
    // Fetch the payment details for this application ID
    if (this.applicationId) {
      this.applicationService.getRepayments(this.applicationId).subscribe(
        (data) => {
          this.repayments = data;  // Set the repayment data
          console.log(this.repayments);
          
        },
        (error) => {
          this.errorMessage = 'Error loading payment details';
          console.error('Error fetching repayments', error);
        }
      );
    }
  }
}
