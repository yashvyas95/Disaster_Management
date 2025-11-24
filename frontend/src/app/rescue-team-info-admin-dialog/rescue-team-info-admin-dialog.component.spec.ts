import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueTeamInfoAdminDialogComponent } from './rescue-team-info-admin-dialog.component';

describe('RescueTeamInfoAdminDialogComponent', () => {
  let component: RescueTeamInfoAdminDialogComponent;
  let fixture: ComponentFixture<RescueTeamInfoAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescueTeamInfoAdminDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueTeamInfoAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
