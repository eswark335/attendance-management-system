import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSchedules } from './manage-schedules';

describe('ManageSchedules', () => {
  let component: ManageSchedules;
  let fixture: ComponentFixture<ManageSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSchedules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
