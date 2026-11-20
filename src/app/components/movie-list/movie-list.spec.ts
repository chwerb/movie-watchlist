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
    // Use the original two movies as a predictable test fixture.
    movieService.getMovies().filter(movie => movie.id > 2).forEach(movie => movieService.deleteMovie(movie.id));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select each movie\'s current category when the cards first appear', () => {
    expect((fixture.nativeElement.querySelector('#category-1') as HTMLSelectElement).value).toBe('Sci-Fi');
    expect((fixture.nativeElement.querySelector('#category-2') as HTMLSelectElement).value).toBe('Romance');
  });

  it('should show movies added to the service', () => {
    movieService.addMovie({
      id: 3,
      title: 'Arrival',
      genre: 'Sci-Fi',
      year: 2016,
      watched: false,
      rating: null
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Arrival');
  });

  it('should let users set and change a rating without changing other movies or watched status', () => {
    const cards = fixture.nativeElement.querySelectorAll('.movie-card') as NodeListOf<HTMLElement>;
    const stars = cards[0].querySelectorAll<HTMLInputElement>('input[type="radio"]');

    expect(cards[0].textContent).toContain('Not rated yet');
    expect(cards[0].querySelectorAll('.rating-star.filled').length).toBe(0);

    stars[3].focus();
    stars[3].click();
    fixture.detectChanges();

    expect(movieService.getMovies()[0].rating).toBe(4);
    expect(cards[0].querySelectorAll('.rating-star.filled').length).toBe(4);
    expect(stars[3].checked).toBe(true);
    expect(stars[3].ownerDocument.activeElement).toBe(stars[3]);
    expect(cards[0].textContent).toContain('4 / 5 stars');
    expect(movieService.getMovies()[0].watched).toBe(false);
    expect(movieService.getMovies()[1].rating).toBeNull();

    const updatedCard = fixture.nativeElement.querySelector('.movie-card') as HTMLElement;
    updatedCard.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1].click();
    fixture.detectChanges();

    expect(movieService.getMovies()[0].rating).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.movie-card:first-child .rating-star.filled').length).toBe(2);
  });

  it('should let users clear a rating', () => {
    movieService.rateMovie(1, 5);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.clear-rating') as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.movie-card') as HTMLElement;
    expect(movieService.getMovies()[0].rating).toBeNull();
    expect(card.textContent).toContain('Not rated yet');
    expect(card.querySelectorAll('.rating-star.filled').length).toBe(0);
    expect(card.querySelectorAll('input:checked').length).toBe(0);
    expect(card.querySelector('.clear-rating')).toBeNull();
  });

  describe('search, filters, and sorting', () => {
    beforeEach(async () => {
      movieService.rateMovie(1, 4);
      movieService.rateMovie(2, 1);
      movieService.addMovie({ id: 3, title: 'Arrival', genre: 'Sci-Fi', year: 2016, watched: true, rating: 5 });
      movieService.addMovie({ id: 4, title: 'Blade Runner', genre: 'Sci-Fi', year: 1982, watched: true, rating: 3 });
      movieService.addMovie({ id: 5, title: 'Alien', genre: 'Horror', year: 1979, watched: false, rating: null });
      fixture.detectChanges();
      await fixture.whenStable();
    });

    function displayedTitles(): string[] {
      return Array.from(fixture.nativeElement.querySelectorAll('.movie-card h2') as NodeListOf<HTMLElement>)
        .map(heading => heading.textContent!.trim());
    }

    async function selectOption(selector: string, value: string): Promise<void> {
      const select = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await fixture.whenStable();
    }

    async function search(query: string): Promise<void> {
      const input = fixture.nativeElement.querySelector('#movie-search') as HTMLInputElement;
      input.value = query;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('should search titles and genres without case or surrounding whitespace affecting matches', async () => {
      await search('  aRrIvAl  ');
      expect(displayedTitles()).toEqual(['Arrival']);

      await search('sCi-Fi');
      expect(displayedTitles()).toEqual(['Interstellar', 'Arrival', 'Blade Runner']);

      await search('');
      expect(displayedTitles().length).toBe(5);
    });

    it.each([
      ['title-asc', ['Alien', 'Arrival', 'Blade Runner', 'Interstellar', 'Titanic']],
      ['title-desc', ['Titanic', 'Interstellar', 'Blade Runner', 'Arrival', 'Alien']],
      ['year-desc', ['Arrival', 'Interstellar', 'Titanic', 'Blade Runner', 'Alien']],
      ['year-asc', ['Alien', 'Blade Runner', 'Titanic', 'Interstellar', 'Arrival']],
      ['rating-desc', ['Arrival', 'Interstellar', 'Blade Runner', 'Titanic', 'Alien']],
      ['rating-asc', ['Titanic', 'Blade Runner', 'Interstellar', 'Arrival', 'Alien']],
    ])('should sort by %s without rearranging the stored watchlist', async (order, expected) => {
      const originalIds = movieService.getMovies().map(movie => movie.id);
      await selectOption('#movie-sort', order as string);

      expect(displayedTitles()).toEqual(expected);
      expect(movieService.getMovies().map(movie => movie.id)).toEqual(originalIds);
    });

    it('should combine search, minimum rating, release year, and sorting', async () => {
      await search('sci-fi');
      await selectOption('#rating-filter', '4');
      await selectOption('#movie-sort', 'title-asc');
      expect(displayedTitles()).toEqual(['Arrival', 'Interstellar']);

      await selectOption('#year-filter', '2014');
      expect(displayedTitles()).toEqual(['Interstellar']);
      expect(fixture.nativeElement.querySelector('.list-summary').textContent).toContain('Showing 1 of 5 movies');
    });

    it('should let users change movie categories and filter the collection by category', async () => {
      await selectOption('#category-1', 'Drama');
      expect(movieService.getMovies()[0].genre).toBe('Drama');
      expect(fixture.nativeElement.querySelector('.movie-card').textContent).toContain('Drama');

      await selectOption('#category-filter', 'Sci-Fi');
      expect(displayedTitles()).toEqual(['Arrival', 'Blade Runner']);
      await selectOption('#rating-filter', '4');
      expect(displayedTitles()).toEqual(['Arrival']);
    });

    it('should filter unrated movies separately from minimum ratings', async () => {
      await selectOption('#rating-filter', 'unrated');
      expect(displayedTitles()).toEqual(['Alien']);

      await selectOption('#rating-filter', '1');
      expect(displayedTitles()).toEqual(['Interstellar', 'Titanic', 'Arrival', 'Blade Runner']);

      await selectOption('#rating-filter', '5');
      expect(displayedTitles()).toEqual(['Arrival']);
    });

    it('should show a no-results message and reset every control', async () => {
      await search('missing movie');
      await selectOption('#category-filter', 'Sci-Fi');
      await selectOption('#year-filter', '2014');
      await selectOption('#rating-filter', '5');
      await selectOption('#movie-sort', 'title-desc');

      expect(displayedTitles()).toEqual([]);
      expect(fixture.nativeElement.querySelector('.empty-message').textContent).toContain('No movies match');

      (fixture.nativeElement.querySelector('.reset-controls') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(displayedTitles()).toEqual(['Interstellar', 'Titanic', 'Arrival', 'Blade Runner', 'Alien']);
      expect((fixture.nativeElement.querySelector('#movie-search') as HTMLInputElement).value).toBe('');
      expect((fixture.nativeElement.querySelector('#year-filter') as HTMLSelectElement).value).toBe('all');
      expect((fixture.nativeElement.querySelector('#rating-filter') as HTMLSelectElement).value).toBe('all');
      expect((fixture.nativeElement.querySelector('#category-filter') as HTMLSelectElement).value).toBe('');
      expect((fixture.nativeElement.querySelector('#movie-sort') as HTMLSelectElement).value).toBe('default');
      expect(fixture.nativeElement.querySelector('.reset-controls')).toBeNull();
    });

    it('should update results as movies are rated, added, and deleted', async () => {
      await selectOption('#rating-filter', '5');
      await selectOption('#movie-sort', 'title-asc');
      movieService.rateMovie(1, 5);
      fixture.detectChanges();
      expect(displayedTitles()).toEqual(['Arrival', 'Interstellar']);

      movieService.addMovie({ id: 6, title: 'Dune', genre: 'Sci-Fi', year: 2021, watched: true, rating: 5 });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(displayedTitles()).toEqual(['Arrival', 'Dune', 'Interstellar']);
      const yearOptions = Array.from(fixture.nativeElement.querySelectorAll('#year-filter option') as NodeListOf<HTMLOptionElement>)
        .map(option => option.value);
      expect(yearOptions).toContain('2021');

      movieService.deleteMovie(3);
      movieService.rateMovie(1, null);
      fixture.detectChanges();
      expect(displayedTitles()).toEqual(['Dune']);
    });
  });
});
