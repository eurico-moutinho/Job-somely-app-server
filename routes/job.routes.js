const router = require("express").Router();
const mongoose = require('mongoose');

const Job = require('../models/Job.model');
const Company = require('../models/Company.model');
const User = require('../models/User.model');


const { isAuthenticated } = require("../middleware/jwt.middleware")


//READ list of jobs 
router.get('/jobs', (req, res, next) => {
    Job.find()
        .populate("company")
        .then(allJobs => {
            filtered_jobs = allJobs.map(aJob => {
                aJob.applicants = [];
                return aJob;
            });
            res.json(allJobs)
        })
        .catch(err => res.json(err));
});


//CREATE new job
router.post('/jobs', isAuthenticated, (req, res, next) => {
    const jobDetails = {
        title: req.body.title,
        description: req.body.description,
        skills: req.body.skills,
        level: req.body.level,
        location: req.body.location,
        owner: req.payload._id
    };

    User.findById(req.payload._id)
        .then(user => {
            jobDetails.company = user.company
            return Job.create(jobDetails)
        })
        .then(response => {
            console.log(response.company)
            let promise1 = Company.findByIdAndUpdate(jobDetails.company, { $addToSet: { jobs: response._id } }, { new: true })
            let promise2 = Job.findById(response._id)
            return Promise.all([promise1, promise2])
        })
        .then(([response1, response2]) => res.json(response2))
        .catch(err => res.json(err));
});


//READ job details
router.get('/jobs/:jobId', isAuthenticated, (req, res, next) => {
    const { jobId } = req.params;

    //validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Job.findById(jobId)
        .populate('company')
        .populate('applicants')
        .then(job => {
            if (job.owner.toString() !== req.payload._id) {
                job.applicants = [];
            }
            res.status(200).json(job)
        })
        .catch(error => res.json(error));
});


//UPDATE job
router.put('/jobs/:jobId', isAuthenticated, (req, res, next) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Job.findById(jobId).then((job) => {
        if (job.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })

        .then(() => Job.findByIdAndUpdate(jobId, req.body, { new: true }))
        .then((updatedJob) => res.json(updatedJob))
        .catch(error => res.json(error));
});


//DELETE job
router.delete('/jobs/:jobId', isAuthenticated, (req, res, next) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Job.findById(jobId).then((job) => {
        if (job.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })

        .then(() => Job.findByIdAndRemove(jobId))
        .then(() => res.json({ message: `Job with id ${jobId} was removed successfully.` }))
        .catch(error => res.status(500).json(error));
});

// APPLY Jobs
router.post('/apply/:jobId', isAuthenticated, (req, res, next) => {
    console.log("here.....")
    const { jobId } = req.params;
    const userId = req.payload._id;


    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Job.findById(jobId)
        .then((job) => {
            if (job.owner.toString() === req.payload._id) {
                throw 'Specified id is not valid !!!!';
            }
        }).then(() => User.findById(userId))
        .then((user) => {
            if (user.userType === "company") {
                throw 'Companies can not apply !!!!';
            }
            console.log(user)
            return user.candidate
        })
        .then((candidateId) => Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: candidateId } }, { new: true }))
        .then(() => res.json({ message: 'Application Successful !' }))
        .catch(error => res.json(error));
});

// SEARCH Job
router.get('/searchjob', (req, res, next) => {
    const query = req.query.q;
    if (!query) {
        Job.find()
            .populate("company")
            .then(allJobs => {
                filtered_jobs = allJobs.map(aJob => {
                    aJob.applicants = [];
                    return aJob;
                });
                res.json(allJobs)
            })
            .catch(err => res.json(err));
    } else {
        Job.find({ $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } })
            .populate("company")
            .then(allJobs => {
                filtered_jobs = allJobs.map(aJob => {
                    aJob.applicants = [];
                    return aJob;
                });
                res.json(allJobs)
            })
            .catch(err => res.json(err));
    }

});



module.exports = router;
