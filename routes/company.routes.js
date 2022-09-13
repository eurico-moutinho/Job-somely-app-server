const router = require("express").Router();
const mongoose = require('mongoose');

const Company = require('../models/Company.model');
const Job = require('../models/Job.model');
const User = require('../models/User.model');

const { isAuthenticated } = require("../middleware/jwt.middleware")


//READ list of companies 
router.get('/companies', (req, res, next) => {
    Company.find()
        .populate("jobs")
        .then(allCompanies => {
            res.json(allCompanies)
        })
        .catch(err => res.json(err));
});


//CREATE new company
router.post('/companies', isAuthenticated, (req, res, next) => {
    const companyDetails = {
        name: req.body.name,
        jobs: req.body.jobs,
        description: req.body.description,
        address: req.body.address,
        owner: req.payload._id
    }

    Company.create(companyDetails)
        .then(response => {
            let promise1 = User.findByIdAndUpdate(response.owner, { "company": response._id }, { new: true });
            let promise2 = Company.findById(response._id);
            return Promise.all([promise1, promise2])
        })
        .then(([response1, response2]) => res.json(response2))
        .catch(err => res.json(err));
});


//READ company details
router.get('/companies/:companyId', isAuthenticated, (req, res, next) => {
    const { companyId } = req.params;

    //validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Company.findById(companyId)
        .populate('jobs')
        .then(company => res.status(200).json(company))
        .catch(error => res.json(error));
});


//UPDATE company
router.put('/companies/:companyId', isAuthenticated, (req, res, next) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Company.findById(companyId).then((company) => {
        if (company.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })

        .then(() => Company.findByIdAndUpdate(companyId, req.body, { new: true }))
        .then((updatedCompany) => res.json(updatedCompany))
        .catch(error => res.json(error));
});


//DELETE company
router.delete('/companies/:companyId', isAuthenticated, (req, res, next) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Company.findById(companyId).then((company) => {
        if (company.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })

        .then(() => Company.findByIdAndRemove(companyId))
        .then(deteletedCompany => {
            return Job.deleteMany({ _id: { $in: deteletedCompany.jobs } });
        })
        .then(() => res.json({ message: `Company with id ${companyId} & all associated jobs were removed successfully.` }))
        .catch(error => res.status(500).json(error));
});

//GET Company Profil
router.get('/mycompany', isAuthenticated, (req, res, next) => {
    const ownerId = req.payload._id
    User.findById(ownerId)
        .populate("company")
        .then((user) => {
            if (typeof (user.company) !== "undefined") {
                res.json(user.company);
            } else {
                const companyDetails = {
                    name: "",
                    description: "",
                    address: "",
                    owner: ownerId
                }
                res.json(companyDetails);
            }
        })
        .catch(error => res.status(500).json(error));
})

module.exports = router;
