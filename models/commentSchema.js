const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment:{
        type: String,
        // required: true
    },
    date_time: {
        type: Date,
        default: Date.now
    }
})

const Comments = mongoose.model('Comments', commentSchema);

module.exports = Comments;