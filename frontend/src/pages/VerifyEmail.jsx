import React, { useState, useEffect } from 'react';
import { Box, Container, Image, Text, HStack, Spinner, Button } from '@chakra-ui/react';
import { createSearchParams, useParams } from 'react-router-dom';
import { GoVerified } from 'react-icons/go';
import { MdError } from 'react-icons/md';
import { publicRequest } from '../apiRequestMethods';
import PasswordInput from '../components/Form/PasswordInput';
import {CustomToast} from '../components/Toast';
const VerifiedContainer = () => {
    return (
        <Box height={'100%'} p={0}>
            <Box boxSize={['xsm', 'sm']}>
                <Image src='https://cdn.dribbble.com/users/940008/screenshots/3903521/media/79e66ff98ec7d422b9902655a7e07c09.jpg' alt='Dan Abramov' objectFit='cover' />
            </Box>
            <HStack justifyContent={'center'} alignItems={'center'}>
                <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'500'} color={'gray.600'}>Email is verified </Text>
                <GoVerified color='green' />
            </HStack>
        </Box>
    )
}
export default function VerifyEmail() {
    const [spinner, setSpinner] = useState(false);
    const [showVerified, setShowVerified] = useState(false);
    const [password, setPassword] = useState("");
    const {addToast} = CustomToast();
    const param = useParams();
    const token = param?.token;
    const handleSubmit = async ()=>{
        setSpinner(true);
        try {
            await publicRequest.post('/auth/email/verify', {token, password});
            setShowVerified(true);
        } catch (error) {
            const data = error.response.data;
            addToast({
                title:data.errorInfo.errorFor,
                message:data.errorInfo.errorMessage,
                status:'error'
            })
        }
        setSpinner(false);
    };
    return (
        <Container p={5} minW={'100%'} minH={'100dvh'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
            {showVerified?<VerifiedContainer/>:<Box width={['100%', 'auto']}>
                <PasswordInput label={'Enter your password to confirm.'} onChange={(e)=>setPassword(e.target.value)}/>
                <Button onClick={handleSubmit} colorScheme='blue' isDisabled={spinner}>{spinner?<Spinner/>:"Verify"}</Button>
            </Box>}
        </Container>
    )
}
