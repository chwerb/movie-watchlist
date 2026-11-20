import { computed, Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie';
import { DEMO_MOVIES } from '../data/demo-movies';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly movieList = signal<Movie[]>(DEMO_MOVIES.map(movie => ({ ...movie })));

  readonly movies = this.movieList.asReadonly();

  readonly categoryOptions = computed(() => {
    const categories = new Map<string, string>();
    const defaults = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
      'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];

    for (const category of [...defaults, ...this.movieList().map(movie => movie.genre)]) {
      const label = category.trim();
      if (label && !categories.has(label.toLowerCase())) categories.set(label.toLowerCase(), label);
    }

    return [...categories.values()].sort((a, b) => a.localeCompare(b));
  });

  getMovies(): Movie[] {
    return this.movieList();
  }

  addMovie(movie: Movie): void {
    this.movieList.update(movies => [...movies, movie]);
  }

  deleteMovie(id: number): void {
    this.movieList.update(movies => movies.filter(movie => movie.id !== id));
  }

  updateCategory(id: number, category: string): void {
    const trimmed = category.trim();
    if (!trimmed) return;

    const genre = this.categoryOptions().find(option => option.toLowerCase() === trimmed.toLowerCase()) ?? trimmed;
    this.movieList.update(movies => movies.map(movie => movie.id === id ? { ...movie, genre } : movie));
  }

  toggleWatched(id: number): void {
    this.movieList.update(movies => movies.map(movie =>
      movie.id === id ? { ...movie, watched: !movie.watched } : movie
    ));
  }

  rateMovie(id: number, rating: number | null): void {
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return;
    }

    this.movieList.update(movies => movies.map(movie =>
      movie.id === id ? { ...movie, rating } : movie
    ));
  }
}
