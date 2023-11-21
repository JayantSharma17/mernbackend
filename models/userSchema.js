const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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

//hashing the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//Generating JWT token
userSchema.methods.generateAuthToken = async function () {
    try {
        let myToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '3d' });
        // this.tokens = this.tokens.concat({ token: myToken });
        // await this.save();
        return myToken;
    }
    catch (e) {
        console.log(e)
    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;