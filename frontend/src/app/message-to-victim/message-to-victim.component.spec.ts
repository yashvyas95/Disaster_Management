import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageToVictimComponent } from './message-to-victim.component';

describe('MessageToVictimComponent', () => {
  let component: MessageToVictimComponent;
  let fixture: ComponentFixture<MessageToVictimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageToVictimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageToVictimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
