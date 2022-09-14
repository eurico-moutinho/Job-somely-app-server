const router = require("express").Router();
const mongoose = require('mongoose');

const Candidate = require('../models/Candidate.model');
const User = require('../models/User.model');

const { isAuthenticated } = require("../middleware/jwt.middleware");



//READ list of candidates
router.get('/candidates', (req, res, next) => {
    Candidate.find()
        .then(allCandidates => {
            res.json(allCandidates)
        })
        .catch(err => res.json(err));
});

router.post('/candidates', isAuthenticated, (req, res, next) => {
    const  {
        firstName,
        lastName,
        role,
        email,
        phone,
        location,
        about,
        skills,
        image,
        linkedin,
        
    } =req.body

    console.log(req.body)
    Candidate.create({firstName,
        lastName,
        role,
        email,
        phone,
        location,
        about,
        skills,
        image,
        linkedin,
        owner: req.payload._id})
        .then(response => {
            let promise1 = User.findByIdAndUpdate(response.owner, { "candidate": response._id }, { new: true });
            let promise2 = Candidate.findById(response._id);
            return Promise.all([promise1, promise2])
        })
        .then(([response1, response2]) => res.json(response2))
        .catch(err => res.json(err));
});


//READ candidate details
router.get('/candidates/:candidateId', isAuthenticated, (req, res, next) => {
    const { candidateId } = req.params;

    //validate candidateId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Candidate.findById(candidateId)
        .then(candidate => {
            console.log(candidate);
            if (!candidate) {
                throw 'Candidate is not found'
            }
            res.status(200).json(candidate)
        })

        .catch(error => res.status(400).json(error));
});


//UPDATE candidate
router.put('/candidates/:candidateId', isAuthenticated, (req, res, next) => {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Candidate.findById(candidateId).then((candidate) => {
        if (candidate.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })
        .then(() => Candidate.findByIdAndUpdate(candidateId, req.body, { new: true }))
        .then((updatedCandidate) => res.json(updatedCandidate))
        .catch(error => res.json(error));
});


//DELETE candidate
router.delete('/candidates/:candidateId', isAuthenticated, (req, res, next) => {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Candidate.findById(candidateId).then((candidate) => {
        if (candidate.owner.toString() !== req.payload._id) {
            throw 'Specified id is not valid !!!!';
        }
    })
        .then(() => Candidate.findByIdAndRemove(candidateId))
        .then(() => res.json({ message: `Candidate with id ${candidateId} was removed successfully.` }))
        .catch(error => res.status(500).json(error));
});

//GET Candidate Profile
router.get('/myprofile', isAuthenticated, (req, res, next) => {
    const ownerId = req.payload._id
    User.findById(ownerId)
        .populate("candidate")
        .then((user) => {
            if (typeof (user.candidate) !== "undefined") {
                res.json(user.candidate);
            } else {
                const candidateDetails = {
                    firstName: "",
                    lastName: "",
                    role: "",
                    email: user.email,
                    phone: "",
                    location: "",
                    about: "",
                    skills: "",
                    image: "",
                    linkedin: "",
                    owner: ownerId
                }
                res.json(candidateDetails);
            }
        })
        .catch(error => res.status(500).json(error));
})

module.exports = router;