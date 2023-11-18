const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

const Authenticate =async (req, res, next) => {
    try {
        const jwt_cookie = req.cookies.jwt;
        console.log('jwt token = '+jwt_cookie);
        const verifyToken = jwt.verify(jwt_cookie,process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!rootUser){throw new Error('User not found')}

        req.token = jwt_cookie;
        req.rootUser=rootUser;
        req.UserID=rootUser._id;
        next();
    }
    catch (e) {
        res.status(401).send('Unauthorized:No token provided')
        console.log(e)
    }

}
module.exports=Authenticate;