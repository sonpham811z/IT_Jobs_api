import { StatusCodes } from 'http-status-codes'
import { jobService } from '~/services/jobService'
import { jobModel } from '~/models/jobModel'

const createNewJob = async (req, res, next) => {
    try {
        const jobData = req.body

        const newJob = await jobService.createNew( jobData)
        return res.status(StatusCodes.OK).json(newJob)
    } catch (error) {
        next(error)
    }
}


const getNewJobs = async(req, res, next) => {
    try {

        
        const jobs = await jobModel.getNewJobs()
        res.status(StatusCodes.OK).json(jobs)
    } catch (error) {
        next (error)
    }
}

const getJobById = async(req, res, next) => {
    try {
        console.log('hehe');
        const job = await jobService.getJobById(req.params.id)
        return res.status(StatusCodes.OK).json(job)
    } catch (error) {
        next(error)
    }
}

const getJobsByEmployerId = async(req, res, next) =>
{
    try {
        console.log('hehehe')
        const employerId = req.params.employerId
        const jobs = await jobService.getJobsByEmployerId(employerId)
        return res.status(StatusCodes.OK).json(jobs)
    } catch (error) {
        next(error)
    }
}

export const jobController = {
    createNewJob,
    getJobById,
    getJobsByEmployerId,
    getNewJobs
}