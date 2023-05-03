
const errorModal = (errorType, errorFor, errorMessage) => {
    return {
        errorInfo: {
            isError:true,
            errorType,
            errorFor,
            errorMessage
        }
    };
};
const validateEmail = (email)=>{
    return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
}
const validateForm = async (req, res, next) => {
    if (!req.body.fullname || req.body.fullname.trim(" ").length === 0) {
        return res.status(401).json(errorModal("authentication", "fullname", "Fullname is required"));
    }
    if (!req.body.email || !validateEmail(req.body.email)) {
        return res.status(401).json(errorModal("authentication", "email", "Invalid email"));
    }
    if (!req.body.username || req.body.username.trim(" ").length === 0 || req.body.username.indexOf('@')!=-1) {
        return res.status(401).json(errorModal("authentication", "username", "Username is required"));
    }
    if (!req.body.password || req.body.password.trim(" ").length < 8) {
        return res.status(401).json(errorModal("authentication", "password", "Password must be at least 8 character long"));
    }
    return next();
};
module.exports = {validateForm, errorModal, validateEmail};