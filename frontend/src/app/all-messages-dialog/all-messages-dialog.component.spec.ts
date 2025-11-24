import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMessagesDialogComponent } from './all-messages-dialog.component';

describe('AllMessagesDialogComponent', () => {
  let component: AllMessagesDialogComponent;
  let fixture: ComponentFixture<AllMessagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMessagesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMessagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
