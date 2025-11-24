import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueTeamComponent } from './rescue-team.component';

describe('RescueTeamComponent', () => {
  let component: RescueTeamComponent;
  let fixture: ComponentFixture<RescueTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescueTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescueTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
