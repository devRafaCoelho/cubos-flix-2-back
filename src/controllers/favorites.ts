import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const addFavorites = async (req: Request, res: Response) => {
  const { movieId, movieName } = req.body
  const { id: userId } = req.user

  try {
    const data = {
      movieID: movieId,
      movieName: movieName,
      user: {
        connect: {
          id: userId
        }
      }
    }

    const movie = await prisma.favorites.create({ data })

    return res.status(201).json(movie)
  } catch (error) {
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
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const detailMovie = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const movie = await prisma.favorites.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' })
    }

    return res.status(200).json(movie)
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const movie = await prisma.favorites.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' })
    }

    await prisma.favorites.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({ message: 'Filme excluído com sucesso' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
