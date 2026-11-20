import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './components/home/home';
import { MovieList } from './components/movie-list/movie-list';
import { AddMovie } from './components/add-movie/add-movie';
import { Statistics } from './components/statistics/statistics';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MovieList },
  { path: 'add-movie', component: AddMovie },
  { path: 'statistics', component: Statistics }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
