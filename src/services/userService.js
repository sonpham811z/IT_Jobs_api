import { userModel } from '~/models/userModel'

const pickUserData = (user) => {
    if (!user) return null
    
    // Remove sensitive fields
    const { password, ...userData } = user
    return userData
}

const createNew = async(userData) => {
    try {
        // Check if user already exists
        const existingUser = await userModel.findOneByEmail(userData.email)
        if (existingUser) {
            return pickUserData(existingUser)
        }
        
        // Create new user
        const newUser = await userModel.createNew(userData)
        const createdUser = await userModel.findOneById(newUser.insertedId)
        
        return pickUserData(createdUser)
    } catch (error) {
        throw error
    }
}

export const userService = {
    createNew
}
