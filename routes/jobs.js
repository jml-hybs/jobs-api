const { getAllJobs, createJob, deleteJob, editJob, getJob } = require('../controllers/jobs');

const router = require('express').Router();



router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(editJob).delete(deleteJob)

module.exports = router