const mongoose = require('mongoose');
const User = require('./user.model');

const videoSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        hotScore: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        allowComments: {
            type: Boolean,
            default: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

videoSchema.post('save', async (doc) => {
    const user = await User.findById(doc.user);
    user.videos.push(doc._id);
    await user.save();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
