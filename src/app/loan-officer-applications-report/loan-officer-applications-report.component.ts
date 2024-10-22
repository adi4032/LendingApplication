import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-loan-application-status-chart',
  templateUrl: './loan-officer-applications-report.component.html',
  styleUrls: ['./loan-officer-applications-report.component.css']
})
export class LoanApplicationStatusChartComponent implements AfterViewInit {
  public chart: any;
  public apiUrl!: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Use ngAfterViewInit to ensure the chart is rendered after the view is initialized
  ngAfterViewInit(): void {
    this.fetchLoanApplications();
  }

  fetchLoanApplications(): void {
    const officerId = this.authService.getCurrentOfficerId();
    if (officerId) {
      this.apiUrl = `http://localhost:5099/api/LoanApplication/officer/${officerId}`;
      this.http.get<any>(this.apiUrl).subscribe(data => {
        const loanStatus = this.processLoanStatus(data);
        this.renderChart(loanStatus);
      });
    } else {
      console.error('No officer ID found.');
    }
  }

  processLoanStatus(applications: any[]): any {
    const statusCount: { [key: string]: number } = { Approved: 0, Rejected: 0, Pending: 0 };

    applications.forEach(app => {
      const status = app.status.toLowerCase();
      if (status === 'approved') {
        statusCount['Approved']++;
      } else if (status === 'rejected') {
        statusCount['Rejected']++;
      } else if (status === 'pending') {
        statusCount['Pending']++;
      }
    });

    return statusCount;
  }

  renderChart(status: any): void {
    const ctx = (document.getElementById('loanOfficerChart') as HTMLCanvasElement).getContext('2d');
    
    // Ensure previous chart is destroyed before creating a new one
    if (this.chart) {
      this.chart.destroy();
    }

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(status),
          datasets: [
            {
              label: 'Loan Applications Status',
              data: Object.values(status),
              backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
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
        },
      });
    }
  }
}
