const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const candidateSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
            trim: true,
            unique: true,
            lowercase: true
        },
        phone: {
            type: Number,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        about: {
            type: String,
            required: true,
            trim: true
        },
        skills: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String
        },
        linkedin: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = model('Candidate', candidateSchema);