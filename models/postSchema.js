const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    photo: {
        data: Buffer,
        contentType: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    desc:{
        type: String,
        // required: true
    },
    category:{
        type: String,
        default:'all'
    },
    date_time: {
        type: Date,
        default: Date.now
    }
})

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;