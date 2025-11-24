import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageToUserDialogComponent } from './message-to-user-dialog.component';

describe('MessageToUserDialogComponent', () => {
  let component: MessageToUserDialogComponent;
  let fixture: ComponentFixture<MessageToUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageToUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageToUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
