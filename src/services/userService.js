import { userModel } from '~/models/userModel'


const filterAuth0User = (auth0User) => {
  return {
    user_id: auth0User.user_id,
    email: auth0User.email,
    email_verified: auth0User.email_verified,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
    // Các trường profile khác bạn có thể để trống để user điền sau
    title: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    personalLink: '',
    education: [],
    experience: [],
    certificates: [],
    skills: []
  }
}

const pickUserData = (user) => {
    if (!user) return null
    
    // Remove sensitive fields
    const { password, ...userData } = user
    return userData
}

const createNew = async (userDataFromAuth0) => {
  try {
    const filteredUser = filterAuth0User(userDataFromAuth0)

    const existingUser = await userModel.findOneByEmail(filteredUser.email)
    if (existingUser) {
      return pickUserData(existingUser)
    }

    const newUser = await userModel.createNew(filteredUser)
    const createdUser = await userModel.findOneById(newUser.insertedId)

    return pickUserData(createdUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
    createNew
}
