import { Component, computed, inject } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

interface MovieGroup {
  label: string;
  total: number;
  watched: number;
  remaining: number;
}

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class Statistics {
  private readonly movieService = inject(MovieService);
  readonly movies = this.movieService.movies;
  readonly total = computed(() => this.movies().length);
  readonly watched = computed(() => this.movies().filter(movie => movie.watched).length);
  readonly remaining = computed(() => this.total() - this.watched());
  readonly completion = computed(() => this.total() ? Math.round(this.watched() / this.total() * 100) : 0);
  readonly watchedPercent = computed(() => this.total() ? this.watched() / this.total() * 100 : 0);

  readonly byCategory = computed(() => this.groupMovies(movie => movie.genre.trim() || 'Uncategorized')
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label)));
  readonly byYear = computed(() => this.groupMovies(movie => String(movie.year))
    .sort((a, b) => Number(a.label) - Number(b.label)));
  readonly categoryMax = computed(() => Math.max(1, ...this.byCategory().map(group => group.total)));
  readonly yearMax = computed(() => Math.max(1, ...this.byYear().map(group => group.total)));

  private groupMovies(getLabel: (movie: Movie) => string): MovieGroup[] {
    const groups = new Map<string, MovieGroup>();

    for (const movie of this.movies()) {
      const label = getLabel(movie);
      const key = label.toLowerCase();
      const group = groups.get(key) ?? { label, total: 0, watched: 0, remaining: 0 };
      group.total++;
      if (movie.watched) group.watched++;
      else group.remaining++;
      groups.set(key, group);
    }

    return [...groups.values()];
  }
}
