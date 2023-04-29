import React, {useState} from 'react'
import { Container, Box, Text, Avatar, Input, Button, Link, Spinner} from '@chakra-ui/react';
import Logo from '../components/Auth/Logo';
import { publicRequest } from '../apiRequestMethods';
import { CustomToast } from '../components/Toast';
export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [spinner, setSpinner] = useState(false);
    const { addToast } = CustomToast();
    const handleSendResetLink = async ()=>{
        setSpinner(true);
        try {
            await publicRequest.post('/auth/reset/password', {email});
            addToast({
                title: "Mail send",
                message: 'Check your mail inbox',
                status: 'success'
            });
            console.log("hi");
            setSpinner(false);
        } catch (err) {
            addToast({
                title: err.response.data.errorInfo.errorType,
                message: err.response.data.errorInfo.errorMessage,
                status: 'error'
            });
        }
        setSpinner(false);
    }
  return (
   <Container  maxW={'xxl'} minH={'100dvh'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        <Box  display={'flex'}  flexDirection={'column'} justifyItems={'center'} alignItems={'center'} border={['none', 'none','2px solid #F0F0F0']} p={[5, 10]} maxW={['100%', '100%','80%','50%', '30%']} textAlign={'center'}>
            <Logo/>
            <Avatar size={'xl'} src='https://cdn.onlinewebfonts.com/svg/img_202009.png'/>
            <Text mt={4} fontWeight='700'>Trouble with logging in?</Text>
            <Text mt={4} color={'gray.600'}>Enter your email address, phone number or username, and we'll send you a link to get back into your account.</Text>
            <Input mt={4} placeholder='Email address' border={'1px solid gray'} onChange={((e)=>setEmail(e.target.value))}/>
            {!spinner && <Button mt={4} width={'100%'} colorScheme='blue' onClick={handleSendResetLink} >Send Reset Link</Button>}
            {spinner && <Spinner mt={4}/>}
            <Link mt={4} bg='#F0F0F0' width={'100%'} p={2}>Back to Login</Link>
        </Box>
   </Container>
  )
}
