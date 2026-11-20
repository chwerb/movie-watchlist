import { Component, computed, signal, Signal } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

type MovieSort = 'default' | 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc' | 'rating-desc' | 'rating-asc';

@Component({
  selector: 'app-movie-list',
  standalone: false,
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieList {

  readonly movies: Signal<Movie[]>;
  readonly stars = [1, 2, 3, 4, 5];
  readonly searchQuery = signal('');
  readonly yearFilter = signal('all');
  readonly ratingFilter = signal('all');
  readonly categoryFilter = signal('');
  readonly sortOrder = signal<MovieSort>('default');

  get categories(): string[] {
    return this.movieService.categoryOptions();
  }

  readonly categoriesInCollection = computed(() => {
    const used = new Set(this.movies().map(movie => movie.genre.trim().toLowerCase()));
    return this.categories.filter(category => used.has(category.toLowerCase()));
  });

  readonly years = computed(() =>
    [...new Set(this.movies().map(movie => movie.year))].sort((a, b) => b - a)
  );

  readonly hasActiveControls = computed(() =>
    this.searchQuery() !== '' || this.yearFilter() !== 'all' ||
    this.ratingFilter() !== 'all' || this.categoryFilter() !== '' || this.sortOrder() !== 'default'
  );

  readonly visibleMovies = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const year = this.yearFilter();
    const rating = this.ratingFilter();
    const sort = this.sortOrder();
    const category = this.categoryFilter().toLowerCase();

    const movies = this.movies().filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(query) || movie.genre.toLowerCase().includes(query);
      const matchesYear = year === 'all' || movie.year === Number(year);
      const matchesCategory = !category || movie.genre.trim().toLowerCase() === category;
      const matchesRating = rating === 'all' || (rating === 'unrated'
        ? movie.rating === null
        : movie.rating !== null && movie.rating >= Number(rating));

      return matchesSearch && matchesCategory && matchesYear && matchesRating;
    });

    const byTitle = (a: Movie, b: Movie) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });

    return movies.sort((a, b) => {
      switch (sort) {
        case 'title-asc': return byTitle(a, b);
        case 'title-desc': return byTitle(b, a);
        case 'year-desc': return b.year - a.year || byTitle(a, b);
        case 'year-asc': return a.year - b.year || byTitle(a, b);
        case 'rating-desc':
        case 'rating-asc':
          // Unrated movies stay last in either rating order.
          if (a.rating === null) return b.rating === null ? byTitle(a, b) : 1;
          if (b.rating === null) return -1;
          return (sort === 'rating-desc' ? b.rating - a.rating : a.rating - b.rating) || byTitle(a, b);
        default: return 0;
      }
    });
  });

  constructor(private movieService: MovieService) {
    this.movies = movieService.movies;
  }

  trackMovieById(_index: number, movie: Movie): number {
    return movie.id;
  }

  setSortOrder(order: string): void {
    this.sortOrder.set(order as MovieSort);
  }

  resetControls(): void {
    this.searchQuery.set('');
    this.yearFilter.set('all');
    this.ratingFilter.set('all');
    this.categoryFilter.set('');
    this.sortOrder.set('default');
  }

  deleteMovie(id: number): void {
    this.movieService.deleteMovie(id);
  }

  toggleWatched(id: number): void {
    this.movieService.toggleWatched(id);
  }

  rateMovie(id: number, rating: number | null): void {
    this.movieService.rateMovie(id, rating);
  }

  updateCategory(id: number, category: string): void {
    this.movieService.updateCategory(id, category);
  }
}
