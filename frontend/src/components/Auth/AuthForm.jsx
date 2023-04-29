import React, { useState } from 'react';
import {
    Flex,
    Heading,
    Button,
    VStack,
    Link as ChakraLink,
    Text,
    CircularProgress
} from '@chakra-ui/react';
import FormContainer from '../Form/FormContainer';
import SimpleInput from '../Form/SimpleInput';
import PasswordInput from '../Form/PasswordInput';
import { Link } from 'react-router-dom';
const LoginForm = ({ handleFormData, error }) => {
    return (
        <>
            <SimpleInput
                isInvalid = {error.isError && error.errorFor === 'username_email' }
                label='Username or Email'
                variant='filled'
                name='username_email'
                placeholder='joe@example.com'
                size='lg'
                onChange={handleFormData}
            />
            <PasswordInput
                isInvalid = {error.isError && error.errorFor === 'password' }
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
const SignUpForm = ({ handleFormData }) => {
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
                onChange={handleFormData}
            />
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
        </>
    )

}
export default function AuthForm({ handleRequest, handleFormData, error,isFetching }) {
    // isLogin ==> true means login page, flase means signup page
    const [isLogin, setIsLogin] = useState(true);
    const handleSubmit = (e)=>{
        e.preventDefault();
        handleRequest(isLogin);
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
                    <SignUpForm handleFormData={handleFormData} error={error}/>
                }
                <ChakraLink color='blue.400' my={4} as={Link} to='/resetpassword' alignSelf={'flex-end'}>Forgotten Password?</ChakraLink>
                <VStack>
                    {
                        isFetching?
                        <CircularProgress isIndeterminate color='blue.400' />:
                        <Button
                        type='submit'
                        size='lg'
                        bg='blue.400'
                        color='white'
                        _hover={{ bg: 'blue.300' }}
                        width='100%'
                        aria-label="submit_btn"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                    }
                </VStack>
            </FormContainer>
        </>

    )
};