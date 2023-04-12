import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

type User = {
  id: number
  name: string
  email: string
  password: string
  confirmPassword: string
  newPassword?: string | null
  confirmNewPassword?: string | null
}

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  try {
    const isUser = await prisma.user.findUnique({ where: { email } })
    if (isUser) return res.status(400).json({ error: { email: 'E-mail já cadastrado' } })

    const encryptedPassword = await bcrypt.hash(password, 10)

    const data = {
      name,
      email,
      password: encryptedPassword
    }

    const registeredUser = await prisma.user.create({ data })

    const { password: _, ...userData } = registeredUser

    return res.status(201).json(userData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: { email: 'E-mail inválido' } })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ error: { password: 'Senha inválida' } })

    const token = jwt.sign({ id: user.id }, '123456', {
      expiresIn: '1h'
    })

    const { password: _, ...userData } = user

    return res.status(201).json({ user: userData, token })
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const detailUser = async (req: Request, res: Response) => {
  try {
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }

    return res.status(200).json(userData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, newPassword, confirmNewPassword } = req.body
  const { id, email: userEmail } = req.user

  const encryptedPassword = await bcrypt.hash(password, 10)
  const encryptedNewPassword = newPassword ? await bcrypt.hash(newPassword, 10) : null

  let data = {
    name,
    email,
    password: encryptedNewPassword ? encryptedNewPassword : encryptedPassword
  }

  if (newPassword && !confirmNewPassword) {
    return res.status(400).json({ error: { confirmNewPassword: 'Confirme a nova senha' } })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      return res.status(400).json({ error: { user: 'Usuário não encontrado' } })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ error: { password: 'Senha inválida' } })

    const isEmail =
      userEmail !== email ? await prisma.user.findUnique({ where: { email: email } }) : null
    if (isEmail) return res.status(400).json({ error: { email: 'E-mail já cadastrado' } })

    await prisma.user.update({
      where: { id: id },
      data: data
    })

    return res.status(204).send()
  } catch (error) {
    console.log(error)

    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.user

  try {
    await prisma.user.delete({
      where: { id: id }
    })

    return res.status(204).send()
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
