import React, { useState } from 'react';
import {
    Flex,
    Heading,
    Button,
    VStack,
    Link as ChakraLink,
    Text,
    CircularProgress,
} from '@chakra-ui/react';
import FormContainer from '../Form/FormContainer';
import SimpleInput from '../Form/SimpleInput';
import PasswordInput from '../Form/PasswordInput';
import { publicRequest } from '../../apiRequestMethods';
import { Link } from 'react-router-dom';
import OTPInput from '../Form/OTPInput';
import { CustomToast } from '../Toast';
const LoginForm = ({ handleFormData, error }) => {
    return (
        <>
            <SimpleInput
                isInvalid={error.isError && error.errorFor === 'username_email'}
                label='Username or Email'
                variant='filled'
                name='username_email'
                placeholder='joe@example.com'
                size='lg'
                onChange={handleFormData}
            />
            <PasswordInput
                isInvalid={error.isError && error.errorFor === 'password'}
                variant='filled'
                name='password'
                label={"Password"}
                placeholder={'********'}
                size='lg'
                onChange={handleFormData}
            />
        </>
    )

}
const SignUpForm = ({ handleFormData, setUsernameAvailable, usernameAvailable, otp, setOTP, showOtp }) => {
    const [showAvailablity, setShowAvailablity] = useState(false);
    const checkUserName = async (username) => {
        try {
            const res = await publicRequest.post('/find/username', { username });
            if (res.status === 200) setUsernameAvailable(true);
        } catch (error) {
            setUsernameAvailable(false);
        }
    };
    const handleOnChangeUsername = (e) => {
        handleFormData(e);
        if (e.target.value?.trim().length > 3) {
            setShowAvailablity(true);
            checkUserName(e.target.value);
        }
        else setShowAvailablity(false);
    };
    return (
        <>
            <SimpleInput
                // isInvalid = {props.state.validationMessage.emailInvalid === true }
                label='Fullname'
                variant='filled'
                name='fullname'
                placeholder='John Wick'
                size='lg'
                onChange={handleFormData}
            />
            <SimpleInput
                // isInvalid = {props.state.validationMessage.emailInvalid === true }
                label='Username'
                variant='filled'
                name='username'
                placeholder='username'
                size='lg'
                onChange={handleOnChangeUsername}
            />
            {showAvailablity && <Text my={2} color={usernameAvailable ? 'green.400' : 'red.400'}>{usernameAvailable ? 'Username is available' : 'Username is not available'}</Text>}
            <SimpleInput
                // isInvalid = {props.state.validationMessage.emailInvalid === true }
                label='Email'
                variant='filled'
                name='email'
                placeholder='joe@example.com'
                size='lg'
                onChange={handleFormData}
            />
            <PasswordInput
                // isInvalid = {props.state.validationMessage.passwordInvalid === true}
                variant='filled'
                name='password'
                label={"Password"}
                placeholder={'********'}
                size='lg'
                onChange={handleFormData}
            />
            {showOtp && <OTPInput onChange={handleFormData} setOTP = {setOTP}/>}
        </>
    )

}
export default function AuthForm({ handleRequest, handleFormData, error, isFetching,setIsFetching, otp, setOTP, credentials }) {
    // isLogin ==> true means login page, flase means signup page
    const {addToast} = CustomToast();
    const [isLogin, setIsLogin] = useState(true);
    const [usernameAvailable, setUsernameAvailable] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const sendOtp = async ()=>{
        setIsFetching(true);
        try {
            const res = await publicRequest.post('/auth/register/sendotp', {email:credentials.email, fullname:credentials.fullname});
            setShowOtp(true);
            addToast({
                title:"OTP send",
                message:"Check your inbox for otp",
                status:'success'
            })
        } catch (error) {
            addToast({
                title:"Server error",
                message:"try again",
                status:'error'
            })
            setShowOtp(false);
        }
        setIsFetching(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!showOtp && !isLogin)
            sendOtp();
        else handleRequest(isLogin);
    }
    return (
        <>
            <Heading alignSelf='flex-start' paddingTop='10px'>{isLogin ? "Login" : 'Sign Up'}</Heading>
            <Flex w='100%' justifyContent='flex-start'>
                {isLogin && <Text fontWeight='bold' color='gray.500'>Don't have an account? <ChakraLink onClick={() => setIsLogin(prevState => !prevState)} color='blue.400'>Sign-Up</ChakraLink></Text>}
                {!isLogin && <Text fontWeight='bold' color='gray.500'>Already have an account? <ChakraLink onClick={() => setIsLogin(prevState => !prevState)} color='blue.400'>Login</ChakraLink></Text>}
            </Flex>
            <FormContainer handleSubmit={handleSubmit} method='POST'>

                {
                    isLogin ?
                        <LoginForm handleFormData={handleFormData} error={error} /> :
                        <SignUpForm  showOtp= {showOtp} handleFormData={handleFormData} error={error}  otp={otp} setOTP={setOTP} setUsernameAvailable={setUsernameAvailable} usernameAvailable={usernameAvailable} />
                }
                <ChakraLink color='blue.400' my={4} as={Link} to='/resetpassword' alignSelf={'flex-end'}>Forgotten Password?</ChakraLink>
                <VStack>
                    {
                        isFetching ?
                            <CircularProgress isIndeterminate color='blue.400' /> :
                            <Button
                                type='submit'
                                size='lg'
                                bg='blue.400'
                                color='white'
                                _hover={{ bg: 'blue.300' }}
                                width='100%'
                                aria-label="submit_btn"
                                isDisabled={!isLogin && !usernameAvailable}
                            >
                                {isLogin ? 'Login' : showOtp?'Sign Up':'Send OTP'}
                            </Button>
                    }
                </VStack>
            </FormContainer>
        </>

    )
};