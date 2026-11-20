export interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
  watched: boolean;
  rating: number | null;
}
