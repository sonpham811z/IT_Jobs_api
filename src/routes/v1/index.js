import express from 'express'
import { userRoutes } from './userRoute'
import { employerRoute } from './employerRoute'
import { jobRoute } from './jobRoute'
import { applyRoute } from './appliesRoute'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Connected to API', code: StatusCodes.OK })
})

Router.use('/users', userRoutes)
Router.use('/employers', employerRoute)
Router.use('/jobs', jobRoute)
Router.use('/apply', applyRoute)

export const v1Router = Router