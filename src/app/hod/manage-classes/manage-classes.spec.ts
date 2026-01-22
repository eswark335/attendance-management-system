import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClasses } from './manage-classes';

describe('ManageClasses', () => {
  let component: ManageClasses;
  let fixture: ComponentFixture<ManageClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClasses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
