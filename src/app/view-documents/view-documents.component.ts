import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonalDocument } from '../modules/admin/components/loan-officer-list/model/loan-application.model';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrl: './view-documents.component.css'
})
export class ViewDocumentsComponent implements OnInit{
  applicationId: string | null = null;
  personalDocuments: PersonalDocument[] = [];

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService // Use the service to fetch documents
  ) {}

  ngOnInit(): void {
    // Fetch the application ID from the route parameters
    this.applicationId = this.route.snapshot.paramMap.get('applicationId');

    if (this.applicationId) {
      this.loadDocuments();
    } else {
      console.error('Application ID is missing from the route');
      // You can also display an error message to the user here
    }
  }

  loadDocuments(): void {
    if (!this.applicationId) {
      return;
    }

    // Call the service to fetch personal documents
    this.loanService.getPersonalDocumentsByApplicationId(this.applicationId).subscribe(
      (documents: PersonalDocument[]) => {
        this.personalDocuments = documents;
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
        // Optionally, show a user-friendly message on the UI
      }
    );
  }
  
} 
