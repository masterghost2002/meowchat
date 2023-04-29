const router = require("express").Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
router.get('/messages/:userId', async (req, res)=>{
    const {userId} = req.params;
    const token = req.cookies?.token;
    let data;
    if(token){
        data = await jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, result)=>{
            if(err) throw err;
            return result;
        })
    }
    else
    return res.status(422).json("Token not found"); 

    // user who is requesting the data
    const {id} = data;
    try {
        const messageData = await Message.find({
            sender:{$in:[userId, id]},
            recipient:{$in:[userId, id]}
        }).sort({createdAt:1});
        return res.status(200).json(messageData);
    } catch (error) {
        return res.status(404).json([]);
    }

});

module.exports = router;