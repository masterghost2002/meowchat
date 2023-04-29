require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
require('./database/db');
const app = express();
const auth = require('./controller/auth');
const message = require('./controller/messages');
const peoples = require('./controller/findPeoples');
const {wss }= require('./controller/wsServer');
const cors = require('cors');
app.use(cors({
    credentials:true,
    origin:process.env.ORIGIN_URL
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth', auth);
app.use('/api/people', peoples);
app.use('/api/',message);
const server = app.listen(process.env.PORT, ()=>{console.log('listening to '+process.env.PORT)});
wss(server);