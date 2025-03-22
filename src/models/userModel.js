import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    sub: Joi.string(), // ID từ Auth0
    email: Joi.string().required().email(),
    email_verified: Joi.boolean().default(false),
    name: Joi.string().required().min(2).max(50).trim().strict(),
    nickname: Joi.string().required().min(2).max(50),
    picture: Joi.string().uri().optional(),
    role: Joi.string().valid('user', 'admin').default('user'), // Phân quyền
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(null)
})

const validate = async(data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(userData) => {
    try {
        const dataUserValidated = await validate(userData)
        const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(dataUserValidated)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findOneByEmail = async(Useremail) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            email: Useremail
        })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneByEmail
}