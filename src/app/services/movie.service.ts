import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly movieList = signal<Movie[]>([
    {
      id: 1,
      title: 'Interstellar',
      genre: 'Sci-Fi',
      year: 2014,
      watched: false
    },
    {
      id: 2,
      title: 'Titanic',
      genre: 'Romance',
      year: 1997,
      watched: true
    }
  ]);

  readonly movies = this.movieList.asReadonly();

  getMovies(): Movie[] {
    return this.movieList();
  }

  addMovie(movie: Movie): void {
    this.movieList.update(movies => [...movies, movie]);
  }

  deleteMovie(id: number): void {
    this.movieList.update(movies => movies.filter(movie => movie.id !== id));
  }

  toggleWatched(id: number): void {
    this.movieList.update(movies => movies.map(movie =>
      movie.id === id ? { ...movie, watched: !movie.watched } : movie
    ));
  }
}