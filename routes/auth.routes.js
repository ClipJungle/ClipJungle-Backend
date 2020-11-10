const router = require('express').Router()
const User = require('../models/user.model')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Import Utils
const { getUserByUsername } = require('../utils/users.utils')

// Register a user
router.post('/register', async (req, res) => {
    const { password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        ...req.body,
        password: hashedPassword
    })

    await newUser.save()
    res.json(newUser)
})

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await getUserByUsername(username)

    if (!user) {
        return res.json(null)
    }

    if (! await bcrypt.compare(password, user.password)) {
        return res.json(null)
    }

    const payload = {
        id: user._id,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: ++process.env.ACCESS_TOKEN_LIFE
    })

    res.json(accessToken)
})

module.exports = router