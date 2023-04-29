import React, { useState, useContext } from 'react';
import { UserContext } from '../../userContext';
import {
    Container,
    VStack,
    Box,
    IconButton,
    useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Logo from './Logo';
import AuthForm from './AuthForm';
import { publicRequest } from '../../apiRequestMethods';
import { CustomToast } from '../Toast';
export default function AuthContainer() {
    const { addToast } = CustomToast();
    const [credentials, setCredentials] = useState({ username_email: "", password: "" });
    const [isFetching, setIsFetching] = useState(false);
    const { setUserName, setId, setAvatar, setFullName, setEmail } = useContext(UserContext);
    const [error, setError] = useState({});
    const handleFormData = (e) => {
        e.preventDefault();
        setError({});
        setCredentials(prevState => {
            return {
                ...prevState, [e.target.name]: e.target.value
            }
        })
    };
    const handleRequest = async (isLogin) => {
        const requestUrl = isLogin ? '/auth/login' : '/auth/register';
        setIsFetching(true);
        try {
            const res = await publicRequest.post(requestUrl, credentials);
            if (!isLogin) {
                addToast({
                    title: 'Account Created',
                    message: 'Redirecting',
                    status: 'success'
                });
                return;
            }
            setUserName(res.data.username);
            setId(res.data._id);
            setFullName(res.data.fullname);
            setAvatar(res.data.avatar);
            setEmail(res.data.email);
        } catch (err) {
            setError(err.response.data.errorInfo);
            addToast({
                title: err.response.data.errorInfo.errorType,
                message: err.response.data.errorInfo.errorMessage,
                status: 'error'
            });
        }
        setIsFetching(false);
    }
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Container maxWidth="container.xlg" display='flex' minHeight={'100dvh'} >
            <Box
                border={['none', '2px']}
                mx='auto'
                my='10'
                borderColor={['none', 'gray.300']}
                p={[5, 10]}
                w={['100%', 'md']}
                alignSelf={['center', 'center']}
                borderRadius={['none', '8px']}
            >
                <Box textAlign='right'>
                    <IconButton
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon color='yellow.300' />}
                        onClick={toggleColorMode}
                        variant='ghost'
                        aria-label="switch_theme"
                    />
                </Box>
                <Logo />
                <VStack spacing={4} width='full'>
                    <AuthForm handleFormData={handleFormData} handleRequest={handleRequest} error={error} isFetching={isFetching} />
                </VStack>
            </Box>
        </Container>
    )
}