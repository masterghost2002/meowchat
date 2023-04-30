import React, { useState, useEffect } from 'react';
import { Box, Container, Image, Text, HStack, Spinner} from '@chakra-ui/react';
import { GoVerified } from 'react-icons/go';
import { MdError } from 'react-icons/md';
const ExpiredContainer = () => {
    return (
        <Box display={'flex'} flexDirection={'column'}  alignItems={'center'}>
            <MdError size={'150px'} color='red'/>
            <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'500'} color={'gray.600'}>Email verification failed </Text>
            <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'500'} color={'gray.600'}>Token expired </Text>
        </Box>
    )
}
const VerifiedContainer = () => {
    return (
        <Box height={'100%'} p={0}>
            <Box boxSize={['xsm', 'sm']}>
                <Image src='https://cdn.dribbble.com/users/940008/screenshots/3903521/media/79e66ff98ec7d422b9902655a7e07c09.jpg' alt='Dan Abramov' objectFit='cover' />
            </Box>
            <HStack  justifyContent={'center'} alignItems={'center'}>
                <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'500'} color={'gray.600'}>Email is verified </Text>
                <GoVerified color='green' />
            </HStack>
        </Box>
    )
}
export default function VerifyEmail() {
    const [spinner, setSpinner] = useState(true);
    if(spinner){
        return (
            <Container minW={'100%'} minH={'100dvh'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                 <Spinner size='xl' />
                 <Text textAlign={'center'} my={'10'}>Please wait while we are verifying.</Text>
            </Container>
        )
    }
    return (
        <Container p={0} minW={'100%'} minH={'100dvh'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
            <VerifiedContainer />
            <ExpiredContainer/>
        </Container>
    )
}
