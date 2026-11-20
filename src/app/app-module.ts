import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { MovieList } from './components/movie-list/movie-list';
import { AddMovie } from './components/add-movie/add-movie';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Home } from './components/home/home';
import { Statistics } from './components/statistics/statistics';

@NgModule({
  declarations: [App, Navbar, MovieList, AddMovie, Home, Statistics],
  imports: [BrowserModule, CommonModule, FormsModule,AppRoutingModule
],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
