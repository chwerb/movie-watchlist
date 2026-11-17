import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add movies to the watchlist', () => {
    const movie = {
      id: 3,
      title: 'Arrival',
      genre: 'Sci-Fi',
      year: 2016,
      watched: false
    };

    service.addMovie(movie);

    expect(service.getMovies()).toContain(movie);
  });
});
