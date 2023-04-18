import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const addFavorites = async (req: Request, res: Response) => {
  const { movie_id, poster_path, title, vote_average } = req.body
  const { id: userId } = req.user

  try {
    const isFavorite = await prisma.favorites.findUnique({ where: { movie_id } })
    if (isFavorite) return res.status(400).json({ error: { movie_id: 'Filme já favoritado!' } })

    const data = {
      movie_id,
      title,
      poster_path,
      vote_average,
      user: {
        connect: {
          id: userId
        }
      }
    }

    const movie = await prisma.favorites.create({ data })

    return res.status(201).json(movie)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const listFavorites = async (req: Request, res: Response) => {
  const { id: userId } = req.user

  try {
    const favorites = await prisma.favorites.findMany({
      where: {
        userId: userId
      }
    })

    return res.status(200).json(favorites)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const detailMovie = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const isFavorite = await prisma.favorites.findUnique({
      where: {
        movie_id: id
      }
    })

    if (!isFavorite) {
      return res.status(404).json({ message: 'Filme não encontrado' })
    }

    return res.status(200).json(isFavorite)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const deleteFavorites = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const isFavorite = await prisma.favorites.findUnique({
      where: {
        movie_id: id
      }
    })

    if (!isFavorite) {
      return res.status(404).json({ message: 'Filme não encontrado' })
    }

    await prisma.favorites.delete({
      where: {
        movie_id: id
      }
    })

    return res.status(200).json({ message: 'Filme excluído com sucesso' })
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
