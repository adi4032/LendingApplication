import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})


export class ApplicationListComponent implements OnInit {

  applications: any[] = [];
  errorMessage: string | null = null;
  // schemeName: string = '';


  constructor(private applicationService: ApplicationService, private router: Router) { }

  ngOnInit(): void {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fetchApplications(userId);
    } else {
      this.errorMessage = 'User ID not found';
    }
  }

 


  fetchApplications(userId: string) {
    this.applicationService.getApplicationsByUserId(userId).subscribe(
      (data) => {
        this.applications = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load applications';
        console.error('Error fetching applications', error);
      }
    );
  }

  // fetchScheme(schemeId: any) {
  //   this.applicationService.getLoanSchemeById().subscribe(
  //     (data) => {
  //       this.schemeName = data;
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to load applications';
  //       console.error('Error fetching applications', error);
  //     }
  //   );
  // }

   // Handle Make Payment Button click
   onMakePayment(applicationId: any) {
    // Redirect to payment page, passing applicationId as a parameter
    this.router.navigate(['/make-payment', applicationId]);
  }
}