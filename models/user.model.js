const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        followers: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        bio: {
            type: String,
        },
        profilePhoto: {
            type: String,
        },
        totalLikes: {
            type: Number,
            default: 0,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        blockedUsers: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
