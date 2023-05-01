const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String
    },
    avatar_id:{
        type:String,
        unique:true,
        default:null
    },
    password:{
        type:String,
        required:true,
    },
    lastSeen:{
        type:Date,
        default: Date.now
    }
},{timestamps: true});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await CryptoJS.AES.encrypt(this.password, process.env.CRYPTO_SECRET).toString();
});
UserSchema.methods.validatePassword = async function(userSendPassword){
    const decryptPassword = await CryptoJS.AES.decrypt(this.password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
    return userSendPassword === decryptPassword;
}
module.exports = mongoose.model('User', UserSchema);