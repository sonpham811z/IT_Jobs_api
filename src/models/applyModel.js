import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validator'

const APPLY_COLLECTION_NAME = 'applies'

const APPLY_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    employerId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'employerId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    jobId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    cvUrl: Joi.string(),
    status: Joi.string(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await APPLY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newApply = await GET_DB().collection(APPLY_COLLECTION_NAME).insertOne(validData)
        return newApply
    } catch (error) {
        throw new Error(error)
    }
}
const findByEmail = async (email) => {
    return await GET_DB().collection(APPLY_COLLECTION_NAME).find({ email }).toArray()
}

const findByJobId = async (jobId) => {
    return await GET_DB().collection(APPLY_COLLECTION_NAME).find({ jobId: new ObjectId(jobId) }).toArray()
}

const findByEmployerId = async (employerId) => {
    return await GET_DB().collection(APPLY_COLLECTION_NAME).find({ employerId: new ObjectId(employerId) }).toArray()
}

const checkIfApplied = async (email, jobId) => {
    return await GET_DB().collection(APPLY_COLLECTION_NAME).findOne({ email, jobId: new ObjectId(jobId) })
}

export const applyModel = {
    APPLY_COLLECTION_NAME,
    createNew,
    findByEmail,
    findByJobId,
    findByEmployerId,
    checkIfApplied
}