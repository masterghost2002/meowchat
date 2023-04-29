const router = require("express").Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendMail = require('../middleware/mailSender');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const VerifyToken = require('../models/VerifyToken');
const { validateForm, errorModal, validateEmail } = require('../middleware/formValidate');
const verifyToken = require("../models/VerifyToken");
router.get('/profile', (req, res)=>{
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, result)=>{
            if(err) throw err;
            return res.status(201).json(result);
        })
    }
    else
    return res.status(422).json("Token not found");
})
router.post('/register', validateForm, async (req, res) => {
    const userByUsername = await User.findOne({ username: req.body.username });
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByUsername !== null)
        return res.status(401).json(errorModal("authentication", "username", "Username is already registered"));
    if (userByEmail !== null)
        return res.status(401).json(errorModal("authentication", "email", "Email is already registered"));
    const user = new User(
        {
            fullname:req.body.fullname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            avatar: req.body.image ? req.body.image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ71GPRz3ThTOyK4PSj2Z4z0PFcgHfzZeIL0NXxs68dbA&s',
        }
    );
    try {
        await user.save();
        return res.status(200).json('User Created');
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error')
    }
});

router.post('/login', async (req, res) => {
    if (!req.body.username_email || !req.body.password)
        return res.status(500).json(errorModal("authentication", "incomplete_info", "Please Provide all details"));
    const credentials = {
        isEmail: validateEmail(req.body.username_email),
        username_email: req.body.username_email,
        password: req.body.password
    }
    try{
        let user;
        if(credentials.isEmail)
            user = await User.findOne({email:credentials.username_email});
        else user = await User.findOne({username:credentials.username_email});
        if (!user) return res.status(401).json(errorModal("authentication", "username_email", "User not found"));


        const isAutenticated = await user.validatePassword(credentials.password)
        if(!isAutenticated) return res.status(401).json(errorModal("authentication", "password", "Incorrect password"));

        const accessToken = await jwt.sign(
            {
                id: user._id,
                username:user.username,
                avatar:user.avatar,
                fullname:user.fullname
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1w" }
        );
        const loginDetails = {...(user._doc)};
        loginDetails.password = undefined;
        return res.cookie('token', accessToken, {sameSite:'none', secure:true}).status(201).json(loginDetails);
    }
    catch(error){
        console.log(error);
        res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
});

router.post('/reset/password', async (req, res, next)=>{
    const {email} = req.body;
    if(!validateEmail(email)) return res.status(401).json(errorModal("Validation", "Email", "Not a valid email address"));
    try {
        const user  = await User.findOne({email:email});
        if(!user) return res.status(401).json(errorModal("authentication", "username_email", "User not found"));
        const resetToken = await crypto.randomBytes(32).toString('hex');
        const token = new VerifyToken(
            {
                token:resetToken,
                email: req.body.email,
            }
        );
        await token.save();
        req.email = email;
        req.name = user.fullname;
        req.resetToken = resetToken;
        req.type = 'Reset Password';
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
}, sendMail);
router.post('/reset/password/verify', async function (req, res){
    const {token, password} = req.body;
    if(password.length<8) return res.status(500).send(errorModal("password", "password", "At least 8 character long."));
    try {
        const userInfo = await VerifyToken.findOne({token:token});
        if(!userInfo) return res.status(500).send(errorModal("Token", "Token", "Token expired"));
        const email = userInfo._doc.email;
        await User.findOneAndUpdate({email}, {password:await CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString()});
        return res.status(201).json("Done");
    } catch (error) {
        return res.status(500).send(errorModal("server", "server", "Server error try again!"));;
    }
});
module.exports = router;