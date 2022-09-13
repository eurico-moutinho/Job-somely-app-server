const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid e-mail address."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "You need to have a username"],
    },
    userType: {
      type: String,
      enum: ['candidate', 'company', 'admin'],
      default: 'candidate',
      required: true
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("User", userSchema);