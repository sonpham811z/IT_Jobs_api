import { userModel } from '~/models/userModel'

export const createNew = async (userData) => {
    try {
        let user = await userModel.findOneByEmail(userData.email)
        console.log(userData)
        if (!user) {
            // Nếu chưa có, tạo user mới
            const newUser = {
                sub: userData.sub,
                email: userData.email,
                email_verified: userData.email_verified,
                name: userData.name,
                nickname: userData.nickname,
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
