import express from 'express'
import { applyController } from '~/controllers/applyController'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware' // middleware multer xử lý file

const Router = express.Router()

Router.route('/applyNewJob')
    .post(uploadMiddleware.upload.single('cv'), applyController.applyJob)

export const applyRoute = Router