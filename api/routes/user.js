const router = require('express').Router()
const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')
const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const validateObjectId = require('../middleware/validateObjectId')
const { createError } = require('../error')

// create user
router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) return next(createError(400, error.details[0].message))

  const user = await User.findOne({ email: req.body.email })
  if (user)
    return next(createError(403, 'User with given email already Exist!'))

  const salt = await bcrypt.genSalt(Number(process.env.SALT))
  const hashPassword = await bcrypt.hash(req.body.password, salt)
  let newUser = await new User({
    ...req.body,
    password: hashPassword,
  }).save()

  newUser.password = undefined
  newUser.__v = undefined
  res
    .status(200)
    .send({ data: newUser, message: 'Account created successfully' })
})

// get all users
router.get('/', admin, async (req, res) => {
  const users = await User.find().select('-password -__v')
  res.status(200).send({ data: users })
})

// get user by id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v')
  res.status(200).send({ data: user })
})

// update user by id
router.put('/:id', [validateObjectId, auth], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
  ).select('-password -__v')
  res.status(200).send({ data: user, message: 'Profile updated successfully' })
})

// delete user by id
router.delete('/:id', [validateObjectId, admin], async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.status(200).send({ message: 'Successfully deleted user.' })
})

module.exports = router
