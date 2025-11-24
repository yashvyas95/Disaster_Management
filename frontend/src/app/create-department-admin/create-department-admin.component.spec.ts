import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartmentAdminComponent } from './create-department-admin.component';

describe('CreateDepartmentAdminComponent', () => {
  let component: CreateDepartmentAdminComponent;
  let fixture: ComponentFixture<CreateDepartmentAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDepartmentAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepartmentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
