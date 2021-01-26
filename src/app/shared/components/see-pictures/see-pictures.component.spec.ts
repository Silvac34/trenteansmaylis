import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePicturesComponent } from './see-pictures.component';

describe('SeePicturesComponent', () => {
  let component: SeePicturesComponent;
  let fixture: ComponentFixture<SeePicturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeePicturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
