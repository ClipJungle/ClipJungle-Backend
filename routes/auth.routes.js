const router = require('express').Router();
const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Import Utils
const {
    getUserByUsername,
    getUserByEmail,
} = require('../utils/users.utils');

// Import email service
const transporter = require('../config/transporter.config');

router.post('/forgot-password-confirmation-email', (req, res) => {
    // 5 digit numeric code
    const confirmationCode =
        Math.floor(Math.random() * 90000) + 10000;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: 'ClipJungle Password Reset',
        text: `Your confirmation code is ${confirmationCode}`,
    };

    transporter.sendMail(mailOptions);

    res.json(confirmationCode);
});

// Send confirmation email
router.post('/register-confirmation-email', (req, res) => {
    // 5 digit numeric code
    const confirmationCode =
        Math.floor(Math.random() * 90000) + 10000;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: 'ClipJungle Confirmation Code',
        text: `Your confirmation code for ${req.body.username} is ${confirmationCode}`,
    };

    transporter.sendMail(mailOptions);

    res.json(confirmationCode);
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
        return res.json(null);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: 'Your ClipJungle Password Has Changed',
        text: `The password for your ClipJungle account was recently changed.`,
    };

    transporter.sendMail(mailOptions);
    res.json('OK');
});

// Register a user
router.post('/register', async (req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
    });

    await newUser.save();
    res.json(newUser);
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) {
        return res.json(null);
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.json(null);
    }

    const payload = {
        id: user._id,
    };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: ++process.env.ACCESS_TOKEN_LIFE,
        },
    );

    res.json(accessToken);
});

module.exports = router;
