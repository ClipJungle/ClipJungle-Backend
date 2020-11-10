const router = require('express').Router()
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

// AUTH ROUTES

router.post('/register', async (req, res) => {
    const {password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        ...req.body,
        password: hashedPassword
    })
    await newUser.save()

    res.json(newUser)
})

// Login a user

// Logout a user

// GENERAL API ROUTES

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find()
    res.json(users)
})

// Delete all users
router.delete('/', async (req, res) => {
    await User.deleteMany()
    res.json('OK')
})

// Get a user with a specific ID
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json(user)
})

// Delete a user with a specific ID
router.delete('/:id', async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    res.json(deletedUser)
})

// Update a user with a specific ID
router.patch('/:id', async (req, res) => {
    let user = await User.findById(req.params.id)
    
    for ([key, value] of Object.entries(req.body)) {
        user[key] = value
    }

    const updatedUser = await user.save()
    res.json(updatedUser)
})

module.exports = router