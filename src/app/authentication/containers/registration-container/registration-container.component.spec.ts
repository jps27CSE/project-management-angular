import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationContainerComponent } from './registration-container.component';

describe('RegistrationContainerComponent', () => {
  let component: RegistrationContainerComponent;
  let fixture: ComponentFixture<RegistrationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
