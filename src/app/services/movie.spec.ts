import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieService);
    // Keep these behavioral tests independent of the size of the demo collection.
    service.getMovies().filter(movie => movie.id > 2).forEach(movie => service.deleteMovie(movie.id));
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
      watched: false,
      rating: null
    };

    service.addMovie(movie);

    expect(service.getMovies()).toContain(movie);
  });

  it.each([0, 6, -1, 2.5, NaN])('should ignore an invalid rating of %s', rating => {
    service.rateMovie(1, 3);
    service.rateMovie(1, rating);

    expect(service.getMovies()[0].rating).toBe(3);
  });

  it('should keep the rating when watched status changes', () => {
    service.rateMovie(1, 4);
    service.toggleWatched(1);

    expect(service.getMovies()[0]).toMatchObject({ watched: true, rating: 4 });
  });

  it('should change a category while preserving other movie details', () => {
    const original = service.getMovies()[0];
    service.updateCategory(1, '  drama  ');

    expect(service.getMovies()[0]).toEqual({ ...original, genre: 'Drama' });
    expect(service.getMovies()[1].genre).toBe('Romance');
  });

  it('should keep custom categories available and reject blank changes', () => {
    service.updateCategory(1, '  Film Noir  ');
    service.updateCategory(1, '   ');

    expect(service.getMovies()[0].genre).toBe('Film Noir');
    expect(service.categoryOptions()).toContain('Film Noir');
  });
});
