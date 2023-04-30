import React , {useState} from 'react'
import { Container, Box, Button } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FormContainer from '../components/Form/FormContainer';
import SimpleInput from '../components/Form/SimpleInput';
import Logo from '../components/Auth/Logo';
import { useParams } from 'react-router-dom';
import { publicRequest } from '../apiRequestMethods';
import { CustomToast } from '../components/Toast';
export default function ResetPasswordVerify() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {addToast} = CustomToast();
  const param = useParams();
  const token = param?.token;
  const navigate = useNavigate();
  const sendResetRequest =  async (e)=>{
    e.preventDefault();
    if(confirmPassword !== password) {
      addToast({
        title: 'Password',
        message: 'Confirm password and password are not same',
        status: 'error'
      });
      return;
  }
    try {
      await publicRequest.post('/auth/reset/password/verify', {password, token});
      return navigate('/');
    } catch (err) {
      addToast({
        title: err.response.data.errorInfo.errorType,
        message: err.response.data.errorInfo.errorMessage,
        status: 'error'
      })
    }
  }
  return (
    <Container maxW={'xxl'} minH={'100dvh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Box width={['100%','50%', '30%']}>
        <Logo/>
        <FormContainer handleSubmit={sendResetRequest}>
            <SimpleInput type={'password'} label={'New Password'} onChange = {e=>setPassword(e.target.value)}/>
            <SimpleInput type='password' label={'New Password confirmation'} onChange = {e=>setConfirmPassword(e.target.value)}/>
            <Button type='submit'>Reset Password</Button>
        </FormContainer>
        </Box>
    </Container>
  )
}
