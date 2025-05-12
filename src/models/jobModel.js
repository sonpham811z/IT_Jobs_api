import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const JOB_COLLECTION_NAME = 'jobs'

const JOB_COLLECTION_SCHEMA = Joi.object({
    employerId: Joi.string().required(),
    title: Joi.string().required(),
    position: Joi.string().required(),
    workplace: Joi.string().valid('remote', 'at-office').required(),
    jobType: Joi.string().valid('full-time', 'part-time', 'internship').required(),
    salary: Joi.object({
        min: Joi.number().min(0).required(),
        max: Joi.number().min(Joi.ref('min')).required()
    }).required(),
    deadline: Joi.date().iso().required(),
    jobDescription: Joi.string().required(),
    jobRequirement: Joi.string().required(),
    benefits: Joi.string().required(),
    locations: Joi.array().items(Joi.string()).min(1).required(),
    skills: Joi.array().items(Joi.string()),
    acceptFresher: Joi.boolean().default(false),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await JOB_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newJob = await GET_DB().collection(JOB_COLLECTION_NAME).insertOne({
            ...validData,
            employerId: new ObjectId(validData.employerId)
        })
        return newJob
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (jobId) => {
    try {
        const job = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(jobId) })
        return job
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (jobId, jobData) => {
    try {
        const job = await GET_DB().collection(JOB_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(jobId) },
            { $set: jobData },
            { returnDocument: 'after' }
        )
        return job
    } catch (error) {
        throw new Error(error)
    }
}

const findByEmployerId = async (employerId) => {
    return await GET_DB()
        .collection(JOB_COLLECTION_NAME)
        .find({ employerId: new ObjectId(employerId), _destroy: false })
        .toArray()
}

const getNewJobs = async () => {
    try {
        const jobs = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .aggregate([
                {
                    $match: { _destroy: false }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 26
                },
                {
                    $lookup: {
                        from: 'employers',
                        localField: 'employerId',
                        foreignField: '_id',
                        as: 'employerName'
                    }
                },
                {
                    $unwind: {
                        path: '$employerName',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        skills: 1,
                        employerId: 1,
                        companyName: '$employerName.companyName',
                        logoURL: '$employerName.logoURL'
                    }
                }
            ])
            .toArray()

        return jobs
    } catch (error) {
        throw new Error(error.message || error)
    }
}

export const jobModel = {
    JOB_COLLECTION_NAME,
    JOB_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    update,
    findByEmployerId,
    getNewJobs
}
