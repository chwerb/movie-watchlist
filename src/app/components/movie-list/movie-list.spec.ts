import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MovieList } from './movie-list';
import { MovieService } from '../../services/movie.service';

describe('MovieList', () => {
  let component: MovieList;
  let fixture: ComponentFixture<MovieList>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [MovieList],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieList);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show movies added to the service', () => {
    movieService.addMovie({
      id: 3,
      title: 'Arrival',
      genre: 'Sci-Fi',
      year: 2016,
      watched: false
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Arrival');
  });
});
