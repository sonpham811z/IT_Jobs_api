import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
    try {
        const userData = req.body // Nhận dữ liệu từ Auth0 callback

        const user = await userService.createNew(userData)
        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        next(error)
    }
}

export const userController = {
    createNew
}