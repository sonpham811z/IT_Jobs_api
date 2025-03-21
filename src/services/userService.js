import { userModel } from '~/models/userModel'

export const createNew = async (userData) => {
    try {
        let user = await userModel.findOneByEmail(userData.email)

        if (!user) {
            // Nếu chưa có, tạo user mới
            const newUser = {
                auth0Id: userData.sub,
                email: userData.email,
                name: userData.name,
                picture: userData.picture
            }
            const result = await userModel.createNew(newUser)
            user = { ...newUser, _id: result.insertedId }
        }

        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const userService = {
    createNew
}
