import express from 'express'
import { userRoutes } from './userRoute'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Connected to API', code: StatusCodes.OK })
})

Router.use('/users', userRoutes)

export const v1Router = Router