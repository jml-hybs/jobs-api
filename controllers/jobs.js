const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')

/* 
        NOTE!

        USING FindById SEARCHES THE WHOLE DATABASE EVEN WHEN YOU SPECIFY THE USER SPECIFIC ID (USERID) WHILE
        USING FindOne SEARCHES FOR A SPECIFIC DOCUMENT IN THE DATABASE IF YOU SPECIFY THE USERID

        I THINK IT'S BECAUSE OF FindById ONLY ACCEPTS OR SEARCHES FOR _ID EVEN IF YOU SPECIFY THE USERID
        WHILE FindOnE ACCEPTS BOTH _ID: jobId AND CREATEBY: userId
*/


const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.burat.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const createJob = async (req, res) => {
    req.body.createdBy = req.burat.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getJob = async (req, res) => {
    const job = await Job.findOne({ createdBy: req.burat.userId, _id: req.params.id })
    if (!job) {
        throw new NotFoundError(`Cannot find the job with the id ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ job })
}


const editJob = async (req, res) => {
    const { params: { id: jobId }, burat: { userId } } = req
    const { company, position } = req.body
    //console.log(company, position);

    if (!company || !position) {
        throw new BadRequestError('Fill up empty fields')
    }

    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, { company, position }, { new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    //code below is an alternative to editJob
    //findJob.company = company || findJob.company
    // findJob.position = position || findJob.position

    //console.log(findJob.company, findJob.position);
    //const updatedJob = await findJob.save()


    res.status(StatusCodes.ACCEPTED).json({ job })
}
const deleteJob = async (req, res) => {
    const { params: { id: jobId }, burat: { userId } } = req

    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })


    if (!job) {
        throw new NotFoundError('Cannot Find The Job To Be Deleted')
    }



    res.status(StatusCodes.ACCEPTED).json({ job })

}
module.exports = { getAllJobs, createJob, getJob, deleteJob, editJob }

/*    const { burat: { userId }, params: { id: jobId } } = req

    const job = await Job.find({ createdBy: userId, _id: jobId })
    res.status(StatusCodes.OK).json({ job, count: job.length }) */