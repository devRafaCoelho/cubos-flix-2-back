import { Router } from 'express'
import { deleteUser, detailUser, login, registerUser, updateUser } from './controllers/user'
import { validateAuthentication } from './middlewares/validateAuthentication'
import { validateRequest } from './middlewares/validateRequest'
import { schemaUser, schemaUserLogin } from './schemas/schemas'
import { addFavorites, deleteMovie, detailMovie, listFavorites } from './controllers/favorites'

const routes = Router()

routes.post('/register', validateRequest(schemaUser), registerUser)
routes.post('/login', validateRequest(schemaUserLogin), login)

routes.use(validateAuthentication)

routes.get('/user', detailUser)
routes.put('/user', validateRequest(schemaUser), updateUser)
routes.delete('/user', deleteUser)

routes.post('/favorites', addFavorites)
routes.get('/favorites', listFavorites)
routes.get('/favorites/:id', detailMovie)
routes.delete('/favorites/:id', deleteMovie)

export default routes
