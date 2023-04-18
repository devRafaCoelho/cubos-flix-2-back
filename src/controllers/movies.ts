import { Request, Response } from 'express'
import axios from 'axios'
import { formatDate } from '../utils/format'

export const listMovies = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}&include_adult=false`
    )

    return res.status(200).json(response.data)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const getMovie = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}`
    )

    if (!response.data) {
      return res.status(404).json({ message: 'Filme não encontrado' })
    }

    const video = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.API_KEY}`
    )
    const officialTrailerIndex = video.data.results.length > 1 ? video.data.results.length - 1 : 0

    const linkVideo = `https://www.youtube.com/watch?v=${video.data.results[officialTrailerIndex].key}`

    const movieData = {
      ...response.data,
      linkVideo
    }
    return res.status(200).json(movieData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const highlightMovie = async (req: Request, res: Response) => {
  try {
    const movieData = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.API_KEY}&include_adult=false`
    )

    const movieGenres = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieData.data.results[0].id}?api_key=${process.env.API_KEY}`
    )

    const movieTrailer = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieData.data.results[0].id}/videos?api_key=${process.env.API_KEY}`
    )

    const arrayGenres = movieGenres.data.genres.map((genre: any) => genre.name.toUpperCase())

    const officialTrailerIndex =
      movieTrailer.data.results.length > 1 ? movieTrailer.data.results.length - 1 : 0

    const highlightVideo = `https://www.youtube.com/watch?v=${movieTrailer.data.results[officialTrailerIndex].key}`

    const highlightData = {
      backgroundImage: `https://image.tmdb.org/t/p/original${movieData.data.results[0].backdrop_path}`,
      title: movieData.data.results[0].title,
      rating: movieData.data.results[0].vote_average.toFixed(1),
      description: movieData.data.results[0].overview,
      genres: arrayGenres,
      date: formatDate(movieData.data.results[0].release_date),
      linkVideo: highlightVideo
    }

    return res.status(200).json(highlightData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const findMovie = async (req: Request, res: Response) => {
  const { movieName } = req.query

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&include_adult=false&query=${movieName}`
    )

    return res.status(200).json(response.data)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
