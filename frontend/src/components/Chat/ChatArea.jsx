import React, { useEffect, useRef } from 'react';
import { Container, Text, IconButton, VStack, Avatar, HStack, Box, Link, Image, Progress  } from '@chakra-ui/react';
import ChatForm from './ChatForm';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineArrowLeft, AiOutlineFilePdf } from 'react-icons/ai';
const isImage = format => {
    let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
    return allowedExtension.indexOf(format) != -1;
}
const HeaderLabel = ({ headerRef, userInfo, isMobile, setSelectedUser, lastSeen }) => {
    if (!userInfo) return;

    return (
        <Container ref={headerRef} maxW={isMobile ? '100%' : '80%'} position={'fixed'} id='header-label' p={0}>
            <Container display={'flex'} maxW={'100%'} alignItems={'center'} background='rgba(255, 255, 255, 0.5)' backdropFilter={'blur(10px)'} p={2}>
                <IconButton
                    aria-label='back'
                    bg='transparent'
                    icon={<IoIosArrowBack size={30}
                        onClick={() => setSelectedUser(null)} />}
                />
                <Avatar size='md' src={userInfo.avatar} mx={5} />
                <VStack spacing={0} padding={0} align='stretch'>
                    <Text fontSize={'28px'}>{userInfo.username}</Text>
                    <Text>{userInfo.isOnline ? "Online" : lastSeen}</Text>
                </VStack>
            </Container>
        </Container>
    )
}
const FileContainer = ({ file, isMe }) => {
    return (
        <Link href={file.url} isExternal={true} display={'flex'} mb={2} style={{ textDecoration: 'none' }} flexDirection={'column'} width={'100%'} >
            {isImage(file.format) && <Image src={file.url} height={'300px'} width={'100%'} objectFit='cover' />}
            <Box display={'flex'} alignItems={'center'}  bg={isMe?'blue.500':'blackAlpha.100'} p={2} borderRadius={6}>
                {!isImage(file.format) && <AiOutlineFilePdf size={20} />}
                <Box ml={2}>
                    <Text >{file.name}</Text>
                    <Text fontSize={'10px'}>{file.size && file.size}</Text>
                </Box>
            </Box>
        </Link>
    )
}
export default function ChatArea(
    {
        scrollMCB,
        divUnderMessages,
        messages,
        sendMessage,
        user,
        isMobile,
        setSelectedUser,
        setNewMessage,
        newMessage,
        setScrollButton,
        loggedUserId,
        sendFile,
        isSendingFile,
        isFetchingMessages
        
    }) {

    
    const messageContainer = useRef();
    const chatAreaRef = useRef();
    const headerRef = useRef();
    const monthName = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dev"]
    // date handeling
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    function handleDateInfo(dateString) {
        const dateFromString = new Date(dateString);
        const currentDate = new Date();
        const time = formatAMPM(dateFromString);
        const date = dateFromString.getDate();
        const month = dateFromString.getMonth();
        const year = dateFromString.getFullYear();
        const toDisplay = `${time} ${date === currentDate.getDate() ? " " : date} ${month === currentDate.getMonth() && year === currentDate.getFullYear() ? " " : monthName[month]} ${year === currentDate.getFullYear() ? " " : year}`
        return toDisplay;
    }
    // function to scroll to bottom using button
    const handleScrollToSetScrollButton = () => {
        const div = messageContainer.current;
        const div2 = chatAreaRef.current;
        const div3 = headerRef.current;
        if (!div || !div2 || !div3) return;

        if (div2.offsetHeight + div2.scrollTop + div3.offsetHeight + 200 < div.offsetHeight)
            setScrollButton(true);
        else setScrollButton(false);

    }
    const lastSeen = user && user.lastSeen ? handleDateInfo(user.lastSeen) : 'Offline';
    

    // to scroll the message box on bottom on first  mount
    useEffect(() => {
        scrollMCB();
    }, [user, messages])
    if (!user) {
        return (
            <Container maxWidth={'100%'}
                padding={'0px'}
                display={'flex'}
                alignItems={'center'}
                height={'100%'}
                justifyContent={'center'}
                p={0}
                background='rgba(255, 255, 255, 0.5)' backdropFilter={'blur(2px)'}
            >
                <HStack color={'blue.400'} >
                    <AiOutlineArrowLeft size={30} />
                    <Text fontSize={'28px'}>Select a chat from sidebar</Text>
                </HStack>
            </Container>
        )
    }
    return (
        <Container
            maxWidth={'100%'}
            padding={'0px'}
            display={'flex'}
            flexDirection={'column'}
            minH={isMobile ? '100dvh' : '100vh'}
            maxH={isMobile ? '100dvh' : '100vh'}
            position={'relative'}
            p={0}

        >
            <Container ref={chatAreaRef}
                maxWidth={'100%'} flex={30} p={0} maxH={'100%'}
                overflowY={'auto'}
                onScroll={handleScrollToSetScrollButton}
            >
                <HeaderLabel headerRef={headerRef} userInfo={user} isMobile={isMobile} setSelectedUser={setSelectedUser} lastSeen={lastSeen} />
                {!isFetchingMessages &&
                    <Container
                        display={'flex'}
                        flexDirection={'column'}
                        maxW={'100%'}
                        mt={20}
                        maxH={'100%'}
                        ref={messageContainer}
                    >
                        {
                            messages.map((message, index) => {
                                const dateToDisplay = handleDateInfo(message.createdAt);
                                return (
                                    <Box
                                        key={index}
                                        alignSelf={message.sender === loggedUserId ? 'flex-end' : 'flex-start'}
                                        backgroundColor={message.sender === loggedUserId ? 'blue.400' : 'white'}
                                        margin={2}
                                        padding={3}
                                        flexWrap={'wrap'}
                                        maxWidth={'80%'}
                                        height={'auto'}
                                        display={'flex'}
                                        color={message.sender === loggedUserId ? 'white' : 'blue.400'}
                                        borderRadius={message.file ? 10 : 22}
                                        justifyContent={'space-between'}
                                        fontFamily={`'Poppins', sans-serif`}
                                        fontWeight={500}
                                    >
                                        {message.file && <FileContainer file={message.file} isMe = {message.sender === loggedUserId} />}
                                        <Text fontFamily={`'Poppins', sans-serif`} alignSelf={'center'} fontSize={isMobile ? '18px' : '22px'}>{message.text}</Text>
                                        <Text marginLeft={2} fontWeight={600} fontSize={isMobile ? '10px' : '16px'} alignSelf={'flex-end'}>{dateToDisplay}</Text>
                                    </Box>

                                )
                            })
                        }
                        <div ref={divUnderMessages}></div>
                    </Container>
                }
            </Container>
            {user && <ChatForm setNewMessage={setNewMessage} newMessage={newMessage} sendMessage={sendMessage} sendFile={sendFile} />}
        </Container>
    )
}
