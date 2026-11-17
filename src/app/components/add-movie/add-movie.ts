import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-add-movie',
  standalone: false,
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.css'
})
export class AddMovie {

  title = '';
  genre = '';
  year = 2026;

  constructor(private movieService: MovieService) {}

  addMovie(): void {
    if (this.title.trim() === '' || this.genre.trim() === '') {
      alert('Please enter the title and genre');
      return;
    }

    const newMovie: Movie = {
      id: Date.now(),
      title: this.title,
      genre: this.genre,
      year: this.year,
      watched: false
    };

    this.movieService.addMovie(newMovie);

    this.title = '';
    this.genre = '';
    this.year = 2026;

    alert('Movie added successfully!');
  }
}