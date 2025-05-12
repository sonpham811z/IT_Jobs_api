import { StatusCodes } from 'http-status-codes'
import { applyService } from '~/services/applyService'

const applyJob = async(req, res, next) => {
    try {
        const file = req.file // CV file from multer
        const result = await applyService.createApply(req.body, file)
        res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}

export const applyController = {
    applyJob
}