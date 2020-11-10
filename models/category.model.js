const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId
    }],
}, {
    timestamps: true
})

const Cateogry = mongoose.model('Cateogry', categorySchema)

module.exports = Cateogry