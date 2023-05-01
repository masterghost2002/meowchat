const cloudinary = require('cloudinary').v2 
const uploadImage = async (req, res, next)=>{
    const file = req.files?req.files.avatar:null;
    const avatar_id = req.user?.avatar_id;
    if(!file){
        return next();
    }
    if(avatar_id){
        try {
            await cloudinary.uploader.destroy(avatar_id);
        } catch (error) {
            console.log(error);
        }
    }
    try{
        const res = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'meowchat_profiles'
        });
        req.body.avatar = res.secure_url;
        req.body.avatar_id = res.public_id;
        next();
    }catch(error){
        return res.status(500).json(error);
    }
};
module.exports = {uploadImage};