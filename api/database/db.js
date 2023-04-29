const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URI)
    .then(()=>console.log("Connected to database"))
    .catch(err=>console.log(err));

module.exports = mongoose;