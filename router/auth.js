const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const Posts = require('../models/postSchema');
const formidable = require('express-formidable');
const fs = require('fs');

router.get('/', (req, res) => {
    const jwt_cookie = req.cookies.jwt;
    console.log(req.cookies);
    res.send('This is router home');
})
//______________________________________________________________________________________________________________________
// Create Account API
router.post('/register', async (req, res) => {
    const { name, user_name, email, password } = req.body;
    if (!name || !user_name || !email || !password) {
        return res.status(422).send('All fields are required.')
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ message: 'email already exist', response: userExist });
        }
        const userExist_user_name = await User.findOne({ user_name: user_name });
        if (userExist_user_name) {
            return res.status(422).json({ message: 'Username already exist', response: userExist });
        }
        // console.log(userExist)
        const userdata = new User({ name, user_name, email, password });

        //middleware password hashing working here from userSchema
        const response = await userdata.save();
        res.status(201).json({ message: "Registration successfull.", response: response })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e, message: 'Registration unsuccesfull' })
    }
})
//______________________________________________________________________________________________________________________
// Login API
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            const isMatch = await bcrypt.compare(password, emailExist.password);
            if (isMatch) {
                console.log(emailExist)
                const token = await emailExist.generateAuthToken();
                console.log(token);
                res.status(201).json({ message: "Login successfully", response: emailExist, token: token });
                console.log('"login successfully"');
            }
            else {
                res.status(400).json({ message: "Invalid Credentials p" });
            }
        }
        else {
            res.status(400).json({ message: "Invalid Credentials m" });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
});
//______________________________________________________________________________________________________________________
//Create the post on website
router.post('/create-post', async (req, res) => {
    try {
        const { userId, desc } = req.fields;
        const { path, type } = req.files.file;
        console.log(path, type)
        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(path);

        // Convert the image buffer to a Base64 string
        const base64Image = imageBuffer.toString('base64');
        const postData = new Posts({ userId, desc });
        if (path && type) {
            postData.photo.data = base64Image;
            postData.photo.contentType = type;
        }
        // console.log(req.fields)
        const response = await postData.save();
        res.status(201).json({ message: "Post uploaded successfully.", response: response })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e, message: 'Post not uploaded' })
    }
})

router.get('/create-post', async (req, res) => {
    try {
        const response = await Posts.find({}).populate('userId');
        res.status(201).json({ message: "All Posts", response: response })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e, message: 'Unable to fetch all Posts.' })
    }
})
//______________________________________________________________________________________________________________________
// User authentication
router.get('/about', authenticate, (req, res) => {
    console.log('about page')
    res.send(req.rootUser)
})

module.exports = router;