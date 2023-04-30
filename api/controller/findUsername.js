const router = require("express").Router();
const User = require('../models/User');
const {errorModal } = require('../middleware/formValidate');
router.post('/find/username', async (req, res)=>{
    let username = req.body.username;
    try {
        const user = await User.findOne({username:username});
        if(!user)  return res.status(200).json(errorModal("username", "username", "Username is available"));
        return res.status(404).json(errorModal("username", "username", "Username is not available"));

    } catch (error) {
        res.status(500).json("Server error");
    }
});
module.exports = router;