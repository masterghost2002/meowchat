const ws = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const { format } = require('crypto-js');
const cloudinary = require('cloudinary').v2 ;
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
const wss =  (server) => {
    const wsserver = new ws.WebSocketServer({ server });
    wsserver.on('connection',async (connection, req) => {

        function notifyAboutOnlinePeople(){
            [...wsserver.clients].forEach(client => {
                client.send(JSON.stringify({
                    online: [...wsserver.clients].map(c => ({ userId: c.userId, username: c.username, avatar:c.avatar }))
                }
                ))
            })
        }
        // function to send offline request to the clients if 
        // any uesr become offline (real time offline online)
        connection.isAlive = true;

        connection.timer = setInterval(()=>{
            connection.ping();
            connection.deathTimer = setTimeout(async ()=>{
                connection.isAlive = false;
                clearInterval(connection.timer);
                await User.updateOne({_id:connection.userId}, {
                    lastSeen: Date.now(),
                });
                connection.terminate();
                notifyAboutOnlinePeople();
            }, 1000)
        }, 5000);

        connection.on('pong', ()=>{
            clearTimeout(connection.deathTimer);
        });
        // read username and id from user cookies
        const cookies = req.headers.cookie;
        if (!cookies) return;
        const tokenString = cookies.split(';').find(str => str.startsWith('token='));
        if (!tokenString) return;
        const token = tokenString.split('=')[1];
        const userData = jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, data) => {
            if (err) return undefined;
            return data;
        })
        if (!userData) return;
        const { id, username } = userData;
        const userDataFromDb = await User.findById(id).select('avatar');
        connection.userId = id;
        connection.username = username;
        connection.avatar = userDataFromDb?.avatar;


        // sending message
        connection.on('message', async (message)=>{
            const messageData = JSON.parse(message.toString());
            const {recipient, text, file} = messageData;
            let fileInfo = {};
            if(file){
                try{
                    const res = await cloudinary.uploader.upload(file.data, {
                        folder: 'meowchat_asset'
                    });
                    // console.log(res);
                    fileInfo.url = res.secure_url;
                    fileInfo.name = file.info;
                    fileInfo.format = res.resource_type+'/'+res.format;
                    fileInfo.size = formatBytes(res.bytes);
                }catch(error){
                    console.log(error);
                }
            }
            if(recipient && (text || file)){
                const messageDoc = await Message.create(
                    {
                        sender:connection.userId,
                        recipient,
                        text,
                        file:Object.keys(fileInfo).length!=0?fileInfo:null
                    }
                );
                // find will find only one
                // but what if user is logged in laptop as well as mobile?
                // so use filter,we can only send text thats why we are stringify it

                [...wsserver.clients]
                    .filter(c=>c.userId === recipient)
                    .forEach(c=>c.send(JSON.stringify({
                        text,
                        file:Object.keys(fileInfo).length!=0?fileInfo:null,
                        _id:messageDoc._id,
                        sender:connection.userId,
                        recipient,
                        createdAt: Date.now()
                    })));
            }

        });
        // notify everyone about online people
        notifyAboutOnlinePeople();
    });

   
};
module.exports = { wss };