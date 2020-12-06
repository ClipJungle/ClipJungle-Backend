const router = require('express').Router();
const Clip = require('../models/clip.model');
const User = require('../models/user.model');

const fs = require('fs');
const { Readable } = require('stream');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const axios = require('axios');

const upload = multer();

router.post('/upload', upload.single('clip'), async (req, res) => {
    const { userId, description } = req.body;

    // Convert Buffer into readabale stream
    const readableStream = new Readable({
        read() {
            this.push(req.file.buffer);
            this.push(null);
        },
    });

    // Instantiate ffmpeg object
    const command = ffmpeg({
        source: readableStream,
    }).format('mp4');

    command.ffprobe((err, metadata) => {
        const duration = metadata.streams[0].duration;

        // Clip cannot be longer than 60 seconds
        if (duration > 60) {
            return res.json('Too Long');
        }
    });

    // Create and save new clip into database
    const newClip = new Clip({
        user: userId,
        description: description,
    });

    const savedClip = await newClip.save();

    // Send video to BunnyCDN
    const response = await axios.put(
        `${process.env.BUNNY_CDN_BASE_URL}/clips/${savedClip._id}.mp4`,
        req.file.buffer,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                AccessKey: process.env.BUNNY_CDN_ACCESS_KEY,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        },
    );

    // Add video ID to user object
    const user = await User.findById(userId);
    user.clips.push(savedClip._id);
    await user.save();

    res.json(response.data);
});

router.get('/', async (req, res) => {
    const clips = await Clip.find();
    res.json(clips);
});

router.delete('/', async (req, res) => {
    await Clip.deleteMany();
    res.json('OK');
});

router.delete('/:id', async (req, res) => {
    const response = await axios.delete(
        `${process.env.BUNNY_CDN_BASE_URL}/clips/${req.params.id}.mp4`,
        {
            headers: {
                AccessKey: process.env.BUNNY_CDN_ACCESS_KEY,
            },
        },
    );

    const deletedClip = await Clip.findByIdAndDelete(req.params.id);
    const user = await User.findById(deletedClip.user);
    user.clips = user.clips.filter(
        (clipId) => clipId != req.params.id,
    );

    await user.save();

    res.json(response.data);
});

module.exports = router;
