import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../../shared/components/movie-carousel/movie-carousel.component';
import { VideoContent } from '../../../shared/models/video-content.interface';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { BannerComponent } from '@/app/core/components/banner/banner.component';
import { HeaderComponent } from '@/app/core/components/header/header.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent,MovieCarouselComponent],
  templateUrl: './settings.component.html',
  styles: ``,
})
export default class SettingsComponent implements OnInit {
  
  movieService = inject(MovieService);
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: VideoContent[] = [];
  tvShows: VideoContent[] = [];
  ratedMovies: VideoContent[] = [];
  nowPlayingMovies: VideoContent[] = [];
  popularMovies: VideoContent[] = [];
  topRatedMovies: VideoContent[] = [];
  upcomingMovies: VideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    //this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];

  ngOnInit(): void {
    forkJoin(this.sources)
    .pipe(
      map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated])=>{
        this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[1].id);
        this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[1].id);
        return {movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated}
      })
    ).subscribe((res:any)=>{
      this.movies = res.movies.results as VideoContent[];
      this.tvShows = res.tvShows.results as VideoContent[];
      this.ratedMovies = res.ratedMovies.results as VideoContent[];
      this.nowPlayingMovies = res.nowPlaying.results as VideoContent[];
      this.upcomingMovies = res.upcoming.results as VideoContent[];
      this.popularMovies = res.popular.results as VideoContent[];
      //this.topRatedMovies = res.topRated.results as VideoContent[];
      this.getMovieKey();
    })
  }
  getMovieKey() {
    this.movieService.getBannerVideo(this.movies[0].id)
    .subscribe(res=>{
      console.log(res);
    })
  }
}
