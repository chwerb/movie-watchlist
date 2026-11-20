import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Statistics } from './statistics';

describe('Statistics', () => {
  let fixture: ComponentFixture<Statistics>;
  let component: Statistics;
  let service: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([])],
      declarations: [Statistics]
    }).compileComponents();
    fixture = TestBed.createComponent(Statistics);
    component = fixture.componentInstance;
    service = TestBed.inject(MovieService);
    // Use a small collection so chart totals do not depend on demo data.
    service.getMovies().filter(movie => movie.id > 2).forEach(movie => service.deleteMovie(movie.id));
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should show watched, remaining, total, and completion figures with three charts', () => {
    expect(component.total()).toBe(2);
    expect(component.watched()).toBe(1);
    expect(component.remaining()).toBe(1);
    expect(component.completion()).toBe(50);
    expect(fixture.nativeElement.querySelectorAll('.chart-card').length).toBe(3);
    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-label')).toContain('1 watched, 1 still to watch');
  });

  it('should group categories consistently and order release years chronologically', () => {
    service.addMovie({ id: 3, title: 'Arrival', genre: 'Sci-Fi', year: 2014, watched: true, rating: null });
    service.addMovie({ id: 4, title: 'Another movie', genre: ' sci-fi ', year: 2014, watched: false, rating: null });
    fixture.detectChanges();

    expect(component.byCategory()).toEqual([
      { label: 'Sci-Fi', total: 3, watched: 1, remaining: 2 },
      { label: 'Romance', total: 1, watched: 1, remaining: 0 }
    ]);
    expect(component.byYear()).toEqual([
      { label: '1997', total: 1, watched: 1, remaining: 0 },
      { label: '2014', total: 3, watched: 1, remaining: 2 }
    ]);
    expect(component.byCategory().reduce((total, group) => total + group.total, 0)).toBe(component.total());
    const watchedBar = fixture.nativeElement.querySelector('.category-chart .bar-watched') as HTMLElement;
    expect(parseFloat(watchedBar.style.width)).toBeCloseTo(100 / 3);
  });

  it('should update charts after category and watched-status changes and deletions', () => {
    service.updateCategory(2, 'Sci-Fi');
    service.toggleWatched(1);
    fixture.detectChanges();

    expect(component.byCategory()).toEqual([{ label: 'Sci-Fi', total: 2, watched: 2, remaining: 0 }]);
    expect(component.completion()).toBe(100);
    expect(fixture.nativeElement.querySelector('.progress-ring').getAttribute('stroke-dasharray')).toBe('100 100');

    service.deleteMovie(2);
    fixture.detectChanges();
    expect(component.total()).toBe(1);
    expect(component.byYear().map(group => group.label)).toEqual(['2014']);
  });

  it('should show a useful empty state and zero figures for an empty watchlist', () => {
    service.deleteMovie(1);
    service.deleteMovie(2);
    fixture.detectChanges();

    expect(component.total()).toBe(0);
    expect(component.watched()).toBe(0);
    expect(component.remaining()).toBe(0);
    expect(component.completion()).toBe(0);
    expect(component.watchedPercent()).toBe(0);
    expect(component.byCategory()).toEqual([]);
    expect(component.byYear()).toEqual([]);
    expect(fixture.nativeElement.querySelector('.empty-state').textContent).toContain('Add your first movie');
    expect(fixture.nativeElement.querySelector('.chart-grid')).toBeNull();
  });

  it('should show all movies as still to watch when none is watched', () => {
    service.toggleWatched(2);
    fixture.detectChanges();

    expect(component.watched()).toBe(0);
    expect(component.remaining()).toBe(2);
    expect(component.completion()).toBe(0);
    expect(fixture.nativeElement.querySelector('.progress-ring').getAttribute('stroke-dasharray')).toBe('0 100');
  });
});
