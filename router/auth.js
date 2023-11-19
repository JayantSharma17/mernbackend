const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const Posts = require('../models/postSchema');
const multer=require('multer');
const path = require('path');
const fs = require('fs'); // Node.js File System module



router.get('/', (req, res) => {
    // res.cookie('jwt', '4564843513', { httpOnly: false, secure: true, maxAge: 60000 });
    const jwt_cookie = req.cookies.jwt;
    console.log(req.cookies);
    res.send('This is router home');
})

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
                // res.cookie('jwt',token, { httpOnly: false, secure: true, maxAge: 604800000 });
                // res.cookie("token", token, {
                //     withCredentials: true,
                //     httpOnly: false,
                // });
                // const jwt_cookie = req.cookies.jwt;
                // console.log(req.cookies.token);
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

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join('./Images'))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
}); 
const upload = multer({
    storage:storage
})

router.post('/upload',upload.single('file'),(req,res)=>{
    console.log(req.body.post_likes)
    Posts.create({post_url:req.file.filename})
    .then(result=>res.json(result))
    .catch(err=>{res.json(err); console.log(err);})

})

router.post('/delete-post', async (req, res) => {
    try {
        const { filename } = req.body;

        // Assuming you store images in 'public/Images' directory
        const imagePath = path.join(__dirname, '../public/Images/', filename);
        console.log(imagePath)

        // Check if the file exists
        fs.access(imagePath, fs.constants.F_OK, async (err) => {
            if (err) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Delete the file
            fs.unlink(imagePath, async (unlinkErr) => {
                if (unlinkErr) {
                    return res.status(500).json({ message: 'Failed to delete Post', error: unlinkErr });
                }

                // Remove the image reference from the database
                await Posts.deleteOne({ post_url: filename });

                res.status(200).json({ message: 'Post deleted successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//Create the post on website
router.post('/create', async (req, res) => {
    const { post_url, userId } = req.body;

    try {
        const postData = new Posts({ post_url, userId });
        const response = await postData.save();
        res.status(201).json({ message: "Post uploaded successfully.", response: response })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e, message: 'Post not uploaded' })
    }
})
router.get('/create', async (req, res) => {
    try {
        const response = await Posts.find({}).populate('userId');
        res.status(201).json({ message: "All Posts", response: response })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e, message: 'Unable to fetch all Posts.' })
    }
})

// User authentication
router.get('/about', authenticate, (req, res) => {
    console.log('about page')
    res.send(req.rootUser)
})

module.exports = router;