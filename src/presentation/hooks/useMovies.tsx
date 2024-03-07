import React, { useEffect, useState } from 'react'
import { Movie } from '../../core/entities/movie.entity'
import { moviesNowPlayingUseCase } from '../../core/use-cases/movies/now-playing.use-case'
import { movieDBFetcher } from '../../config/adapters/movieDB.adapter'
import { moviesPopularUseCaase } from '../../core/use-cases/movies/popular.use-case';
import { moviesTopRatedUseCase } from '../../core/use-cases/movies/top-rated.use-case'
import { moviesUpcomingUseCase } from '../../core/use-cases/movies/upcoming.use-case'


let popularPageNumber = 1

export const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([])
    const [popular, setPopular] = useState<Movie[]>([])
    const [topRated, setTopRated] = useState<Movie[]>([])
    const [upcoming, setUpcoming] = useState<Movie[]>([])

    useEffect(() => {
      initialLoad()
    }, [])

    const initialLoad = async() => {
      const nowPlayingPromise = moviesNowPlayingUseCase(movieDBFetcher)
      const popularPromise = moviesPopularUseCaase(movieDBFetcher)
        const topRatedPromise = moviesTopRatedUseCase(movieDBFetcher)
        const upcomingPromise = moviesUpcomingUseCase(movieDBFetcher)
        
       const [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies ] = await Promise.all([nowPlayingPromise, popularPromise, topRatedPromise, upcomingPromise]) 

       setNowPlaying(nowPlayingMovies)
       setPopular(popularMovies)
       setTopRated(topRatedMovies)
       setUpcoming(upcomingMovies)

       setIsLoading(false)
    }
    

  return {
    isLoading,
    nowPlaying,
    popular,
    topRated,
    upcoming,

    //methods
    popularNextPage: async() => {
      popularPageNumber++
      const popularMovies = await moviesPopularUseCaase(movieDBFetcher, {
        page: popularPageNumber
      })
      setPopular(prev => [...prev, ...popularMovies])
    }
  }
}
