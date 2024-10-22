import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType as ChartJsType, ChartData, Chart } from 'chart.js';
 

@Component({
  selector: 'app-loan-distribution-chart',
  templateUrl: './loan-distribution-chart.component.html',
  styleUrl: './loan-distribution-chart.component.css'
})
export class LoanDistributionChartComponent implements AfterViewInit{
    constructor(private http: HttpClient,private router:Router) {}

    ngAfterViewInit(): void {
      this.fetchLoanApplications();
      this.fetchLoanOfficers();
    }
  
    fetchLoanApplications(): void {
      this.http.get('http://localhost:5099/api/LoanApplication').subscribe((data: any) => {
        const loanTypes = this.processData(data);
        this.renderChart(loanTypes);
        console.log(data); // Check the structure of the response
        
        const loanStatus = this.processStatus(data);
        this.renderStatusChart(loanStatus);
      });
    }
  
    processData(applications: any[]): any {
      const loanTypesCount: { [key: string]: number } = {};
  
      applications.forEach(app => {
        const loanType = app.loanType || 'Loan Applications'; // Default label if undefined
        if (loanTypesCount[loanType]) {
          loanTypesCount[loanType]++;
        } else {
          loanTypesCount[loanType] = 1;
        }
      });
  
      return loanTypesCount;
    }
  
    processStatus(applications: any[]): any {
      const statusCount: { [key: string]: number } = { Approved: 0, Rejected: 0 };
  
      applications.forEach(app => {
        const status = app.status; // Assuming the status is available as `status`
        if (status === 'approved') {
          statusCount['Approved']++;
        } else if (status === 'rejected') {
          statusCount['Rejected']++;
        }
      });
  
      return statusCount;
    }
  
    renderChart(loanTypes: any): void {
      const ctx = (document.getElementById('loanApplicationsChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(loanTypes),
            datasets: [
              {
                data: Object.values(loanTypes),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
              },
            ],
          },
          options: {
            responsive: true,
          }
        });
      }
    }
  
    renderStatusChart(status: any): void {
      const ctx = (document.getElementById('loanStatusChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut', // Change to 'bar' for a bar chart
          data: {
            labels: Object.keys(status),
            datasets: [
              {
                label: 'Loan Status',
                data: Object.values(status),
                backgroundColor: ['#4BC0C0', '#FF6384'], // Different colors for approved and rejected
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true, // Start y-axis at 0
              },
            },
          }
        });
      }
    }
  
  
    fetchLoanOfficers(): void {
      // Fetch both active and inactive officers
      this.http.get('http://localhost:5099/api/LoanOfficer').subscribe((activeData: any) => {
        this.http.get('http://localhost:5099/Inactive').subscribe((inactiveData: any) => {
          // Combine active and inactive officers data
          const allOfficers = [...activeData, ...inactiveData];
          const officerCounts = this.processOfficerData(activeData.length, inactiveData.length);
          this.renderOfficerChart(officerCounts);
          console.log('Active Officers:', activeData); // Debugging
          console.log('Inactive Officers:', inactiveData); // Debugging
        });
      });
    }
    
    processOfficerData(activeCount: number, inactiveCount: number): any {
      return {
        Active: activeCount,
        Inactive: inactiveCount
      };
    }
    
    renderOfficerChart(officerCounts: any): void {
      const ctx = (document.getElementById('loanOfficersChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(officerCounts),
            datasets: [
              {
                label: 'Loan Officers',
                data: Object.values(officerCounts),
                backgroundColor: ['#36A2EB', '#FF6384'], // Colors for Active and Inactive
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }
        });
      }
    }  

    goBack(): void {
        this.router.navigate(['/admin-dashboard']);
      }
}
