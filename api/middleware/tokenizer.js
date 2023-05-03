const jwt = require('jsonwebtoken');
const {errorModal} = require('./formValidate');
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json(errorModal("authentication", "Authentication", "Your are not authorized"));
    await jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, result) => {
        if (err) return res.status(401).json(errorModal("authentication", "Authentication", "Your are not authorized"));
        req.user = result;
        next();
    });
};
const build_token = async (user)=>{
    const accessToken = await jwt.sign(
        {
            id: user._id,
            username:user.username,
            avatar:user.avatar,
            fullname:user.fullname,
            email:user.email,
            avatar_id:user.avatar_id
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1w" }
    );
    return accessToken;
}
module.exports = {verifyToken, build_token};