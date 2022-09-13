const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        jobs: [{
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }],
        description: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String
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

module.exports = model('Company', companySchema);