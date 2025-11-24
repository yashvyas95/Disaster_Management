import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueTeamInfoDialogComponent } from './rescue-team-info-dialog.component';

describe('RescueTeamInfoDialogComponent', () => {
  let component: RescueTeamInfoDialogComponent;
  let fixture: ComponentFixture<RescueTeamInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescueTeamInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueTeamInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
