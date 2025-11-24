import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRescueTeamDialogComponent } from './create-rescue-team-dialog.component';

describe('CreateRescueTeamDialogComponent', () => {
  let component: CreateRescueTeamDialogComponent;
  let fixture: ComponentFixture<CreateRescueTeamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRescueTeamDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRescueTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
