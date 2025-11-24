import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueTeamDialogComponent } from './rescue-team-dialog.component';

describe('RescueTeamDialogComponent', () => {
  let component: RescueTeamDialogComponent;
  let fixture: ComponentFixture<RescueTeamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescueTeamDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
