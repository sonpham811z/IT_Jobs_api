import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/login')
    .post(userController.createNew)

export const userRoutes = Router