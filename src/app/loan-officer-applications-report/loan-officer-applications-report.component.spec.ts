import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanOfficerApplicationsReportComponent } from './loan-officer-applications-report.component';

describe('LoanOfficerApplicationsReportComponent', () => {
  let component: LoanOfficerApplicationsReportComponent;
  let fixture: ComponentFixture<LoanOfficerApplicationsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanOfficerApplicationsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanOfficerApplicationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
