const router = require("express").Router();
const User = require('../models/User');
router.get('/', async (req, res)=>{
    let users;
    try {
        users = await User.find({}, {'_id':1, username:1, avatar:1, lastSeen:1});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json("Server error");
    }
});
module.exports = router;