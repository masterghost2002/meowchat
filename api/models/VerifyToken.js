const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tokenModel = new Schema({
    token: String,
    email: String, 
    createdAt: Date
});
tokenModel.path('createdAt').index({expires:600});
const verifyToken = mongoose.model('verifytoken',  tokenModel);
module.exports = verifyToken;