import { Request, Response } from 'express'
import axios from 'axios'

export const listMovies = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}`
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

    return res.status(200).json(response.data)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
