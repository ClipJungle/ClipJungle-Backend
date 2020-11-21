const router = require('express').Router();
const Video = require('../models/video.model');
const User = require('../models/user.model');

const fs = require('fs');
const multer = require('multer');

const axios = require('axios');

const upload = multer();

router.post('/upload', upload.single('video'), async (req, res) => {
    const { userId, description } = req.body;

    const newVideo = new Video({
        user: userId,
        description: description,
    });

    const savedVideo = await newVideo.save();

    const response = await axios.put(
        `${process.env.BUNNY_CDN_BASE_URL}/videos/${savedVideo._id}.mp4`,
        req.file.buffer,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                AccessKey: process.env.BUNNY_CDN_ACCESS_KEY,
            },
        },
    );

    res.json(response.data);
});

router.get('/', async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
});

router.delete('/', async (req, res) => {
    await Video.deleteMany();
    res.json('OK');
});

router.delete('/:id', async (req, res) => {
    const response = await axios.delete(
        `${process.env.BUNNY_CDN_BASE_URL}/videos/${req.params.id}.mp4`,
        {
            headers: {
                AccessKey: process.env.BUNNY_CDN_ACCESS_KEY,
            },
        },
    );

    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    const user = await User.findById(deletedVideo.user);
    user.videos = user.videos.filter(
        (videoId) => videoId != req.params.id,
    );

    await user.save();

    res.json(response.data);
});

module.exports = router;
