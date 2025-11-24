import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployesInfoDialogComponent } from './employes-info-dialog.component';

describe('EmployesInfoDialogComponent', () => {
  let component: EmployesInfoDialogComponent;
  let fixture: ComponentFixture<EmployesInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployesInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployesInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
