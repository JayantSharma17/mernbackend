const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const connectDB = require('./db/conn');
connectDB();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
// app.use(express.static('public'))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// const formidable = require('express-formidable');
// app.use(formidable())



const User = require('./models/userSchema');
const router = require('./router/auth');






const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(router);


// const middleware = (req, res, next) => {
//     console.log('i am middleware')
//     next();
// }
// middleware();

app.get('/', (req, res) => {
    
    res.send('home page')
})
// app.get('/about', middleware, (req, res) => {
//     console.log('about page')
//     res.cookie('about', 'hii');
//     const aboutCookieValue = req.cookies.about;
//     console.log(aboutCookieValue)
//     res.send('about page')
// })
app.get('/contact', (req, res) => {
    res.send('contact page')
})
app.get('/signin', (req, res) => {
    res.send('signin page')
})
app.get('/signup', (req, res) => {
    res.send('signup page')
})
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})