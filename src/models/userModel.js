import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'


const USER_COLLECTION_NAME = 'users'

// Define schemas for education, experience, and certificates
const EDUCATION_SCHEMA = Joi.object({
    school: Joi.string().required(),
    major: Joi.string().required(),
    isCurrentlyStudying: Joi.boolean().default(false),
    fromMonth: Joi.string().required(),
    fromYear: Joi.string().required(),
    toMonth: Joi.string().allow('').when('isCurrentlyStudying', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    toYear: Joi.string().allow('').when('isCurrentlyStudying', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    additionalDetails: Joi.string().allow('')
})

const EXPERIENCE_SCHEMA = Joi.object({
    jobTitle: Joi.string().required(),
    company: Joi.string().required(),
    isCurrentlyWorking: Joi.boolean().default(false),
    fromMonth: Joi.string().required(),
    fromYear: Joi.string().required(),
    toMonth: Joi.string().allow('').when('isCurrentlyWorking', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    toYear: Joi.string().allow('').when('isCurrentlyWorking', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    description: Joi.string().allow('')
})

const CERTIFICATE_SCHEMA = Joi.object({
    certificateName: Joi.string().required(),
    organization: Joi.string().required(),
    issueMonth: Joi.string().required(),
    issueYear: Joi.string().required(),
    description: Joi.string().allow(''),
    certificateURL: Joi.string().allow('')
})

const USER_COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(), // ID từ Auth0
    email: Joi.string().required().email(),
    email_verified: Joi.boolean().default(false),
    name: Joi.string().required().min(2).max(50).trim().strict(),
    nickname: Joi.string().required().min(2).max(50),
    picture: Joi.string().uri().optional(),
    role: Joi.string().valid('user', 'admin').default('user'), // Phân quyền

    // Additional fields for applicant profile
    title: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    dob: Joi.string().allow(''),
    gender: Joi.string().allow(''),
    address: Joi.string().allow(''),
    personalLink: Joi.string().allow(''),
    education: Joi.array().items(EDUCATION_SCHEMA).default([]),
    experience: Joi.array().items(EXPERIENCE_SCHEMA).default([]),
    certificates: Joi.array().items(CERTIFICATE_SCHEMA).default([]),
    skills: Joi.array().items(Joi.string()).default([]),

    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(null)
})

const validate = async(data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(userData) => {
    try {
        console.log(userData);
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

const findOneById = async(userId) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            _id: new ObjectId(userId)
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
    findOneByEmail,
    findOneById
}
