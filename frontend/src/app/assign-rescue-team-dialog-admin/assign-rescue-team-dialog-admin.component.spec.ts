import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRescueTeamDialogAdminComponent } from './assign-rescue-team-dialog-admin.component';

describe('AssignRescueTeamDialogAdminComponent', () => {
  let component: AssignRescueTeamDialogAdminComponent;
  let fixture: ComponentFixture<AssignRescueTeamDialogAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRescueTeamDialogAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRescueTeamDialogAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
