import { Router } from 'express'
import { addFavorites, deleteMovie, detailMovie, listFavorites } from './controllers/favorites'
import { deleteUser, detailUser, login, registerUser, updateUser } from './controllers/user'
import { validateAuthentication } from './middlewares/validateAuthentication'
import { validateRequest } from './middlewares/validateRequest'
import { schemaRegisterUser, schemaUpdateUser, schemaUserLogin } from './schemas/user'
import { getMovie, highlightMovie, listMovies } from './controllers/movies'

const routes = Router()

routes.post('/register', validateRequest(schemaRegisterUser), registerUser)
routes.post('/login', validateRequest(schemaUserLogin), login)

routes.use(validateAuthentication)

routes.get('/user', detailUser)
routes.put('/user', validateRequest(schemaUpdateUser), updateUser)
routes.delete('/user', deleteUser)

routes.get('/movies', listMovies)
routes.get('/movies/:id', getMovie)

routes.get('/highlight', highlightMovie)

routes.post('/favorites', addFavorites)
routes.get('/favorites', listFavorites)
routes.get('/favorites/:id', detailMovie)
routes.delete('/favorites/:id', deleteMovie)

export default routes
