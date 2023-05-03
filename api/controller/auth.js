const router = require("express").Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendMail = require('../middleware/mailSender');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const Token = require('../models/Token');
const { validateForm, errorModal, validateEmail } = require('../middleware/formValidate');
const { uploadImage } = require("../middleware/cloudinaryUpload");
const { verifyToken, build_token } = require('../middleware/tokenizer');
const userOptVerfication = require('../models/OTPModel');

/*
    //* This router will verify the token which comes in cookies from user
*/
const verifyUserOtp = async(request, response, next)=>{
    const {Otp, email} = request.body;
    let existingVerification;
    try{
        existingVerification = await userOptVerfication.findOne({email:email});
    }
    catch(error){
       return response.status(500).json({message: "Server Error"});
    }
    if(!existingVerification)
       return response.status(404).json(errorModal("otp", "OTP", "OTP is experied"));
    const prev_otp = await CryptoJS.AES.decrypt(existingVerification.Otp, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
    console.log(prev_otp, Otp);
    if(prev_otp !== Otp)
        return response.status(400).json(errorModal("otp", "OTP", "OTP is invalid"));
    await userOptVerfication.deleteOne({email: email});
    next();
}
router.get('/profile', verifyToken, async (req, res) => {
    const _id = req.user.id;
    try {
        const user = await User.findById(_id);
        const accessToken = await build_token(user._doc);
        const loginDetails = { ...(user._doc) };
        loginDetails.password = undefined;
        return res.cookie('token', accessToken, { sameSite: 'none', secure: true }).status(201).json(loginDetails);
    } catch (error) {
        return res.cookie('token', null, { sameSite: 'none', secure: true }).status(500);
    }
});

/*
    //* First validateForm verify all the coming details like email username password etc
    //* This router will verify the token which comes in cookies from user
*/
router.post('/register/verify', validateForm,verifyUserOtp, async (req, res) => {
    const userByUsername = await User.findOne({ username: req.body.username });
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByUsername !== null)
        return res.status(401).json(errorModal("authentication", "username", "Username is already registered"));
    if (userByEmail !== null)
        return res.status(401).json(errorModal("authentication", "email", "Email is already registered"));
    const user = new User(
        {
            fullname: req.body.fullname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            avatar: req.body.avatar ? req.body.avatar : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ71GPRz3ThTOyK4PSj2Z4z0PFcgHfzZeIL0NXxs68dbA&s',
        }
    );
    try {
        await user.save();
        return res.status(200).json('User Created');
    } catch (error) {
        return res.status(500).json(errorModal("Server", "Server Error", "Try again."));
    }
});
router.post('/register/sendotp', async (request, response, next) => {
    const { email } = request.body;
    const name = request.name ? request.fullname : request.body.fullname;
    let verification_modal;
    try {
        verification_modal = await userOptVerfication.findOne({ email: email });
    }
    catch (error) {
        return response.status(500).json({ message: "Server Error" });
    }
    if (verification_modal)
        await userOptVerfication.deleteOne({ email: email });
    const Otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newVerficaion = new userOptVerfication({
        Otp: CryptoJS.AES.encrypt(Otp, process.env.CRYPTO_SECRET).toString(),
        email: email,
        createdAt: Date.now()
    });

    request.OTP = Otp;
    try {
        await newVerficaion.save();
    }
    catch (error) {
        return response.status(401).json({ message: "Database transiction error", error: error });
    }
    request.name = name;
    request.type = 'OTP verification'
    next();
}, sendMail)
/*
    //*? POST: LOGIN ROUTE /api/auth/login
    //* If the user is valid send the token in cookies
*/
router.post('/login', async (req, res) => {
    if (!req.body.username_email || !req.body.password)
        return res.status(500).json(errorModal("authentication", "incomplete_info", "Please Provide all details"));
    const credentials = {
        isEmail: validateEmail(req.body.username_email),
        username_email: req.body.username_email,
        password: req.body.password
    }
    try {
        let user;
        if (credentials.isEmail)
            user = await User.findOne({ email: credentials.username_email });
        else user = await User.findOne({ username: credentials.username_email });
        if (!user) return res.status(401).json(errorModal("authentication", "username_email", "User not found"));
        const isAutenticated = await user.validatePassword(credentials.password);
        if (!isAutenticated) return res.status(401).json(errorModal("authentication", "password", "Incorrect password"));
        const accessToken = await build_token(user._doc);
        const loginDetails = { ...(user._doc) };
        loginDetails.password = undefined;
        return res.cookie('token', accessToken, { sameSite: 'none', secure: true }).status(201).json(loginDetails);
    }
    catch (error) {
        res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
});

/*
    //*? POST: LOGIN ROUTE /api/auth/update/user
    //*? Middlewares: verifyToken->uploadImage(if user send the avatar to be upadted)
*/
router.post('/update/user', verifyToken, uploadImage, async (req, res) => {
    const user = req.user;
    const { password, username, fullname, avatar, avatar_id } = req.body;
    let fieldToUpdate = {};

    // ! validation of fields provided by user so, that the empty field not get upadted
    if (password) {
        if (password.trim().length < 8)
            return res.status(400).json(errorModal("invalid", "password", "Password must be at least 8 character long"));
        fieldToUpdate.password = await CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
    };
    if (username) {
        if (username.trim().length < 4)
            return res.status(400).json(errorModal("invalid", "username", "Username must be at least 4 character long"));

        fieldToUpdate.username = username.trim();
    };
    if (fullname) {
        if (fullname.trim().length < 4) return res.status(400).json(errorModal("invalid", "Fullname", "Fullname must be at least 4 character long"));
        fieldToUpdate.fullname = fullname.trim();
    };
    if (avatar) {
        fieldToUpdate.avatar_id = avatar_id;
        fieldToUpdate.avatar = avatar
    };

    //? If nothing is passed by user in fields 
    if (Object.keys(fieldToUpdate).length === 0) return res.status(400).json(errorModal("invalid", "Field", "Nothing to update, fields are empty"));
    try {
        const updatedUser = await User.findOneAndUpdate({ email: user.email }, {
            $set: fieldToUpdate
        }, { new: true });
        const accessToken = await build_token(updatedUser._doc);
        const loginDetails = { ...(updatedUser._doc) };
        loginDetails.password = undefined;
        return res.cookie('token', accessToken, { sameSite: 'none', secure: true }).status(201).json(loginDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json(errorModal("server", "server", "server error"));
    }

});

// password reset flow first send the password reset link then verify it
router.post('/reset/password', async (req, res, next) => {
    const { email } = req.body;
    if (!validateEmail(email)) return res.status(401).json(errorModal("Validation", "Email", "Not a valid email address"));
    try {
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).json(errorModal("authentication", "username_email", "User not found"));
        const resetToken = await crypto.randomBytes(32).toString('hex');
        const token = new Token(
            {
                token: resetToken,
                email: req.body.email,
            }
        );
        await token.save();
        req.email = email;
        req.name = user.fullname;
        req.redirectLink = 'https://meowchat.netlify.app/resetpassword/verify/' + resetToken;
        req.type = 'Reset Password';
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
}, sendMail);
router.post('/reset/password/verify', async function (req, res) {
    const { token, password } = req.body;
    if (password.length < 8) return res.status(500).send(errorModal("password", "password", "At least 8 character long."));
    try {
        const userInfo = await Token.findOneAndDelete({ token: token });
        if (!userInfo) return res.status(500).send(errorModal("Token", "Token", "Token expired"));
        const email = userInfo._doc.email;
        await User.findOneAndUpdate({ email }, { password: await CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString() });
        return res.status(201).send(errorModal("Update", "Password", "Password is updated"));
    } catch (error) {
        return res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
});

/*
    //*? POST: LOGIN ROUTE /api/update/email
    //* this route send the verification token to the user for email verification
*/
router.post('/update/email', async function (req, res, next) {
    const token = req.cookies?.token;
    const { newEmail } = req.body;
    if (!validateEmail(newEmail)) return res.status(400).json(errorModal("email", "Email", "Inavlid Email"));
    let currUser = null;
    if (token) {
        currUser = await jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, result) => {
            if (err) return res.status(401).json(errorModal("authentication", "Authentication", "Your are not authorized"));
            return result;
        })
    };
    try {
        const user = await User.findOne({ email: newEmail });
        if (user) return res.status(400).json(errorModal("email", "Email", "Email is already registered"));
        const resetToken = await crypto.randomBytes(32).toString('hex');
        const token = new Token(
            {
                token: resetToken,
                email: currUser.email,
                newEmail: newEmail
            }
        );
        await token.save();
        req.email = newEmail;
        req.name = currUser.fullname;
        req.type = 'Verify Email';
        req.redirectLink = 'https://meowchat.netlify.app/verify/email/' + resetToken;
        next();

    } catch (err) {
        console.log(err);
        return res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
    return res.status(200).json("Email updated")

}, sendMail);

// for verifiying the new email
router.post('/email/verify', async (req, res) => {
    const { token, password } = req.body;
    if (!token) return res.status(500).send(errorModal("token", "Token", "Invalid Token"));
    try {
        const userInfo = await Token.findOneAndDelete({ token: token });
        if (!userInfo) return res.status(500).send(errorModal("Token", "Token", "Token expired"));
        const email = userInfo._doc.email;
        const user = await User.findOne({ email: email });
        const isAutenticated = await user.validatePassword(password);
        if (!isAutenticated) return res.status(401).json(errorModal("authentication", "password", "Incorrect password"));
        const newEmail = userInfo._doc.newEmail;
        await User.findOneAndUpdate({ email }, { email: newEmail });
        return res.status(200).json("Done");
    } catch (error) {
        return res.status(500).send(errorModal("server", "server", "Server error try again!"));
    }
});
module.exports = router;