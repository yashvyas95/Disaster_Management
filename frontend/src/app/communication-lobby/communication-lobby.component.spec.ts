import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationLobbyComponent } from './communication-lobby.component';

describe('CommunicationLobbyComponent', () => {
  let component: CommunicationLobbyComponent;
  let fixture: ComponentFixture<CommunicationLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationLobbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
