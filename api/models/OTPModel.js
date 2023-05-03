const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userOptVerficationModel = new Schema({
    Otp: String,
    email: String, 
    createdAt: Date
});
userOptVerficationModel.path('createdAt').index({expires:600});
const userOptVerfication = mongoose.model('userOptVerfication',  userOptVerficationModel);
module.exports = userOptVerfication;