import { Component, Signal } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: false,
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieList {

  readonly movies: Signal<Movie[]>;

  constructor(private movieService: MovieService) {
    this.movies = movieService.movies;
  }

  deleteMovie(id: number): void {
    this.movieService.deleteMovie(id);
  }

  toggleWatched(id: number): void {
    this.movieService.toggleWatched(id);
  }
}
