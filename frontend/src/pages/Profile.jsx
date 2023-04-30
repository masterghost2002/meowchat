import React, { useContext, useState } from 'react';
import { Container, SimpleGrid, GridItem, Avatar, Text, Box, Link as ChakraLink, Input, InputGroup, InputRightElement, IconButton, Button } from '@chakra-ui/react';
import { userRequest } from '../apiRequestMethods';
import { UserContext } from '../userContext';
import { BiArrowBack } from 'react-icons/bi';
import { FiEdit2 } from 'react-icons/fi';
import { FcCancel, FcEditImage } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import FormContainer from '../components/Form/FormContainer';
import SimpleInput from '../components/Form/SimpleInput';
import PasswordInput from '../components/Form/PasswordInput';
import { CustomToast } from '../components/Toast';
const NavBar = () => {
  return (
    <Box fontWeight={'500'} display={'flex'} justifyContent={'space-between'}>
      <Box display={'flex'} alignItems={'center'} fontWeight={'500'}>
        <ChakraLink as={Link} to='/'>
          <BiArrowBack />
        </ChakraLink>
        <Text ml={2}>Back to home</Text>
      </Box>
      <Text>Edit Profile</Text>
    </Box>
  )
}
const CustomInput = ({ handleChange, disabled, placeholder, handleClick, buttonIcon, buttonType }) => {
  return (
    <InputGroup size='md' my={2} style={{ transition: 'all linear 1s' }}>
      <Input
        pr='4.5rem'
        type='text'
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => handleChange(e)}
      />
      <InputRightElement width='4.5rem'>
        <IconButton h='1.75rem' size='sm' onClick={handleClick} icon={buttonIcon} type={buttonType && buttonType} />
      </InputRightElement>
    </InputGroup>
  )
}
const EmailContainer = ({ email }) => {
  const { addToast } = CustomToast();
  const [newEmailInput, setNewEmailInput] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const handleClick = () => setNewEmailInput(prevState => !prevState);
  const handleChange = (e) => setNewEmail(e.target.value);
  const handleUpadteEmail = async (e) => {
    e.preventDefault();
    if (email === newEmail) {
      addToast({
        title: "Mail",
        message: 'Previous mail and new mail must not be same',
        status: 'error'
      });
      return;
    }
    try {
      await userRequest.post('/auth/update/email', { newEmail });
      addToast({
        title: "Mail send",
        message: 'Please check mail box for verification',
        status: 'success'
      });
    } catch (err) {
      addToast({
        title: err.response.data.errorInfo.errorType,
        message: err.response.data.errorInfo.errorMessage,
        status: 'error'
      });
    }
  }
  return (
    <Box my={5}>
      <FormContainer >
        <CustomInput disabled={true} placeholder={email} handleClick={handleClick} buttonIcon={newEmailInput ? <FcCancel /> : <FiEdit2 />} />
        {newEmailInput &&
          <CustomInput placeholder={'New Email address'} handleClick={handleUpadteEmail} buttonIcon={<GrUpdate />} handleChange={handleChange} buttonType='submit' />
        }
      </FormContainer>
    </Box>
  )
}
const UpdateAvatarContainer = ({ avatar }) => {
  const [imagePreview, setImagePreview] = useState(avatar);
  const handleFile = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }
  const triggerFileUpload = () => {
    const inputDiv = document.getElementById('fileupload');
    if (inputDiv) inputDiv.click();
  }
  return (
    <Box display={'flex'} alignItems={'center'} mt={5} p={0} justifyContent={'space-between'} >
      <Avatar
        size='xl'
        src={imagePreview}
      />
      <IconButton icon={<FcEditImage />} onClick={triggerFileUpload} />
      <Input id="fileupload" type='file' onChange={handleFile} display={'none'} />
    </Box>
  )
}
export default function Profile() {
  const { avatar, fullname, username, email } = useContext(UserContext);
  return (
    <Container p={0} minW={'100%'}>
      <SimpleGrid
        columns={[1, 1, 6]}
      >
        <GridItem width={'100%'} borderRight={'2px solid #F2F3F5'} p={[5, 20]} colSpan={['1', '2']} maxH={'100dvh'}>
          <Container
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'100%'}
            flexDirection={'column'}
            fontFamily={`Poppins, sans-serif`}
          >
            <Avatar
              size='3xl'
              src={avatar}
            />
            <Text mt={5} fontWeight='600'>{fullname}</Text>
            <Text>{username}</Text>
            <Text color={'gray.600'}>{email}</Text>
          </Container>
        </GridItem>
        <GridItem p={[5, 20]} width={'100%'} display={'flex'} flexDirection={'column'} colSpan={['1', '4']} maxH={'100dvh'} overflow={'auto'}>
          <NavBar />
          <UpdateAvatarContainer avatar={avatar} />
          <EmailContainer email={email} />
          <FormContainer>
            <SimpleInput size='lg' label={'Full Name'} placeholder={fullname} />
            <SimpleInput size='lg' label={'Username'} placeholder={username} />
            <PasswordInput />
            <Button width={'30%'} colorScheme='blue' alignSelf={'flex-end'}>Update</Button>
          </FormContainer>
        </GridItem>
      </SimpleGrid>
    </Container>
  )
}
