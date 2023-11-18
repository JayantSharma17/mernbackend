const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post_url: {
        type: String,
        // required: true
    },
    post_likes: {
        type: Number,
        // required: true,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_time: {
        type: Date,
        default: Date.now
    }
})


const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;