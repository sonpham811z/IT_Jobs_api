import { StatusCodes } from 'http-status-codes'
import { jobModel } from '~/models/jobModel'
import ApiError from '~/utils/ApiError'

const createNew = async (data) => {
    try {
        const newJob = await jobModel.createNew(data)
        return newJob
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}

// const getAllJobs = async (filter = {}, options = {}) => {
//     try {
//         const jobs = await jobModel.find(filter, null, options).sort({ createdAt: -1 })
//         return jobs
//     } catch (error) {
//         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể lấy danh sách job')
//     }
// }

const getJobById = async (jobId) => {
    try {
        const job = await jobModel.findOneById(jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Can not find any job with id')
        }
        return job
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error when get job detail'
        )
    }
}

const getJobsByEmployerId = async(employerId) => {
    try {
        const jobs = await jobModel.findByEmployerId(employerId)
        return jobs
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get jobs')
    }
}

export const jobService= {
    createNew,
    // getAllJobs,
    getJobById,
    getJobsByEmployerId
}
