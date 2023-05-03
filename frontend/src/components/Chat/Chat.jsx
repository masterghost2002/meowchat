import React, { useEffect, useState, useContext, useRef } from 'react'
import { Container, Grid, GridItem, Divider, Avatar, IconButton, Box } from '@chakra-ui/react';
import PeopleList from './PeopleList';
import ChatArea from './ChatArea';
import Logo from '../Auth/Logo';
import { UserContext } from '../../userContext';
import { uniqBy } from 'lodash';
import { CustomToast } from '../Toast';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { userRequest } from '../../apiRequestMethods';
import Menu from '../Menu';
import { delete_cookie } from 'sfcookies';
const wssurl = 'wss://meowchat-backend-production.up.railway.app';
// const wssurl = 'ws://localhost:5000';
const allowedExtension = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp', 'application/pdf'];
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
export default function Chat() {
    // this ref is to scroll to bottom in chat
    const divUnderMessages = useRef();

    // states
    const { addToast } = CustomToast();
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [scrollButton, setScrollButton] = useState(false);
    const [offlinePeople, setOfflinePeople] = useState({});
    const [isSendingFile, setIsSendingFile] = useState(false);
    const [isFetchingMessages, setIsFetchingMessages] = useState(false);
    const { id: loggedUserId, setId, setUserName } = useContext(UserContext);


    // function to connect to websocket
    function connectToWs() {
        const ws = new WebSocket(wssurl);
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        // for auto reconnect
        ws.addEventListener('close', () => {
            addToast({
                title: "Disconnected",
                message: "Trying to connect...",
                status: 'error'
            });
            setTimeout(() => {
                connectToWs();
            }, 2000)
        });
    };

    // handle logOut 
    function handleLogout() {
        setWs(null);
        setId(null);
        setUserName(null);
        delete_cookie('token')
    }

    // function to move message container to bottom MCB message container to bottom
    function scrollMCB() {
        const div = divUnderMessages.current;
        if (div)
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // set the messages coming from wss of online people
    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if ('online' in messageData)
            showOnlinePeople(messageData.online);
        else if ('text' in messageData && messageData.sender === selectedUser) {
            setMessages(prev =>
            (
                uniqBy(
                    [...prev,
                    { ...messageData, isOur: false }
                    ],
                    '_id'
                )
            )
            );
        }
    }

    // fetch the dimension of the window (for mobile view or desktop)
    function getCurrentDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    // function to get online people from wss
    function showOnlinePeople(peopleArray) {
        const people = {};
        // for uniqueness
        peopleArray.forEach(({ userId, username, avatar }) => {
            if (loggedUserId !== userId && userId !== undefined) {
                people[userId] = { username, avatar, isOnline: true };
            }
        });
        setOnlinePeople(people);
    }

    // send message function 
    async function sendMessage(e, file = null, fileDetails = null) {
        // console.log(file);
        if (e)
            e.preventDefault();
        if (!file && newMessage.trim(" ").length === 0) {
            addToast({
                title: "Emtpy Message",
                message: "Cannot send empty message",
                status: 'error'
            });
            return;
        };
        await ws.send(JSON.stringify({
            recipient: selectedUser,
            text: newMessage,
            file,
        }));
        setMessages(prev => ([...prev, {
            text: newMessage,
            isOur: true,
            file:fileDetails,
            sender: loggedUserId,
            recipient: selectedUser,
            _id: Date.now(),
            createdAt: Date.now()
        }
        ]));


        // empty the message
        setNewMessage("");
        // if we use it here then your 1 message will be hidden bcz use state
        // took some time to update the state
        // scrollMCB();
    }

    //function sendFile to send files
    function sendFile(e) {
        const file = e.target.files[0];
        if(allowedExtension.indexOf(file.type) === -1){
            addToast({
                title: "File not supported",
                message: "Only images and pdf are allowed",
                status: 'error'
            });
            return;
        }
        // reset the file input aftert sending the one files else it will not accept another file
        e.target.value = null;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.File)
            sendMessage(null, {
                info: file.name,
                data: reader.result
            },{
                fileName:file.name,
                size:formatBytes(file.size),
                url:URL.createObjectURL(file),
                format:file.type
            });
        };
    }


    // useEffect to fetch the offline user
    useEffect(() => {
        const fetchPeoples = async () => {
            try {
                let res = await userRequest.get('/people');
                const offlinePeopleArr = res.data.filter(p => (p._id !== loggedUserId && onlinePeople[p._id] === undefined));
                const offlinePeopleObj = {};
                offlinePeopleArr.forEach(p => {
                    offlinePeopleObj[p._id] = { ...p, isOnline: false };
                });
                setOfflinePeople(offlinePeopleObj);

            } catch (error) {
                console.log(error)
            }
        }
        fetchPeoples();

    }, [onlinePeople]);



    // to set mobile view and websocket
    useEffect(() => {
        const width = getCurrentDimension().width;
        if (width <= 950)
            setIsMobile(true);
        connectToWs();
    }, []);
    useEffect(() => {
        const updateDimension = () => {
            const width = getCurrentDimension().width;
            if (width <= 950)
                setIsMobile(true);
            else setIsMobile(false);
        }
        window.addEventListener('resize', updateDimension);

        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [isMobile]);

    // fetch messages between the users from db
    useEffect(() => {
        const messagesData = async () => {
            if (!selectedUser) return;
            setIsFetchingMessages(true);
            let res;
            try {
                res = await userRequest.get(`/messages/${selectedUser}`);
                const { data } = res;
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
            setIsFetchingMessages(false);
        }
        messagesData();
    }, [selectedUser]);
    return (
        <Container maxWidth="container.xlg" padding={'0px'} height={isMobile ? '100dvh' : '100dvh'}>
            <Grid
                templateAreas={`"nav main"`}
                gridTemplateRows={'50px 1fr 30px'}
                gridTemplateColumns={isMobile ? (selectedUser === null ? '1fr 0fr' : '0fr 1fr') : '600px 1fr'}
                gap='1'
                minHeight={isMobile ? '100dvh' : '100vh'}
                color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem
                    area={'nav'}
                    p={0}
                    minHeight={isMobile ? '100dvh' : '100vh'}
                    display={isMobile && selectedUser !== null ? 'none' : 'block'}
                    maxWidth={'100%'}
                >
                    <Container py={4} px={4} display={'flex'} alignItems={'center'} position={'sticky'} top={0} zIndex={100} bg={'white'}>
                        <Logo />
                        <Box display={'flex'} alignItems={'center'}>
                            <Avatar
                                size='md'
                                src={'https://cdn3d.iconscout.com/3d/premium/thumb/lovely-cat-4949421-4127167.png'}
                            />
                            <Menu handleLogout={handleLogout} />
                        </Box>
                    </Container>
                    <Divider />
                    <PeopleList
                        onlinePeople={Object.keys(onlinePeople).length > 0 && onlinePeople}
                        offlinePeople={offlinePeople}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                    />
                </GridItem>
                <GridItem
                    display={isMobile && selectedUser === null ? 'none' : 'block'}
                    area={'main'}
                    minHeight='100dvh'
                    maxH={'100dvh'}
                    // backgroundImage={'https://www.filepicker.io/api/file/u5frNNlBQDQbBX0nh9Mg'}
                    backgroundImage='https://i.pinimg.com/564x/94/8b/3d/948b3de8462265d7e76117557c533ffa.jpg'
                    backgroundAttachment={'fixed'}
                    maxWidth={'100%'}
                    position={'relative'}

                >
                    <ChatArea
                        isMobile={isMobile}
                        newMessage={newMessage}
                        user={selectedUser && (onlinePeople[selectedUser] || offlinePeople[selectedUser])}
                        setSelectedUser={setSelectedUser}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                        messages={messages}
                        divUnderMessages={divUnderMessages}
                        scrollMCB={scrollMCB}
                        setScrollButton={setScrollButton}
                        loggedUserId={loggedUserId}
                        setMessages={setMessages}
                        sendFile={sendFile}
                        isSendingFile={isSendingFile}
                        isFetchingMessages={isFetchingMessages}
                    />
                    {scrollButton && <IconButton
                        onClick={scrollMCB}
                        icon={<BsChevronDoubleDown color='white' size={'28px'} />}
                        position={'fixed'}
                        bottom={20} bg='black'
                        _hover={{ color: 'black' }}
                        right={5}
                        borderRadius={'20px'}

                    />}
                </GridItem>
            </Grid>
        </Container>
    )
}
