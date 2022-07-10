const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  month: { type: String },
  date: { type: String },
  year: { type: String },
  likedSongs: { type: [String], default: [] },
  playlists: { type: [String], default: [] },
  isAdmin: { type: Boolean, default: false },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.JWT_TOKEN_KEY,
    { expiresIn: '7d' },
  )
  return token
}

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    month: Joi.string(),
    date: Joi.string(),
    year: Joi.string(),
    gender: Joi.string().valid('male', 'female', 'non-binary').required(),
  })
  return schema.validate(user)
}

const User = mongoose.model('user', userSchema)

module.exports = { User, validate }
