import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMovie } from './add-movie';

describe('AddMovie', () => {
  let component: AddMovie;
  let fixture: ComponentFixture<AddMovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMovie],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
