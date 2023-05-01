import React, { useContext, useState } from 'react';
import { Container, SimpleGrid, GridItem, Avatar, Text, Box, Link as ChakraLink, Input, InputGroup, InputRightElement, IconButton, Button, Spinner } from '@chakra-ui/react';
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
const UpdateAvatarContainer = ({ avatar, setNewAvatar }) => {
  const [imagePreview, setImagePreview] = useState(avatar);
  const handleFile = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setNewAvatar(e.target.files[0]);
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
  const { avatar, fullname, username, email,setUserName, setId, setAvatar, setFullName, setEmail } = useContext(UserContext);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [newUsername, setNewUsername] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newFullname, setNewFullname] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const { addToast } = CustomToast();
  // show is realtime availablity of username
  const checkUserName = async (username) => {
    try {
      const res = await userRequest.post('/find/username', { username });
      if (res.status === 200) setUsernameAvailable(true);
    } catch (error) {
      setUsernameAvailable(false);
    }
  };
  const handleOnChangeUsername = (e) => {
    setNewUsername(e.target.value);
    if (newUsername?.trim().length > 3)
      checkUserName(e.target.value);
  };

  // update user
  const handleOnSubmit = async (e) => {
    // The preventDefault method prevents the browser from issuing the default action which in the case of a form submission is to refresh the page.
    e.preventDefault();
    let newDetails = new FormData();
    if(newUsername) newDetails.append('username', newUsername);
    if(newPassword) newDetails.append('password', newPassword);
    if(newFullname) newDetails.append('fullname', newFullname);
    if(newAvatar) newDetails.append('avatar', newAvatar);
    setSpinner(true);
    try {
      const res = await userRequest.post('/auth/update/user', newDetails);
      addToast({
        title: 'Update',
        message: 'Your profile is updated.',
        status: 'success'
      });
      setUserName(res.data.username);
      setId(res.data._id);
      setFullName(res.data.fullname);
      setAvatar(res.data.avatar);
      setEmail(res.data.email);
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      addToast({
        title: err.response.data.errorInfo.errorType,
        message: err.response.data.errorInfo.errorMessage,
        status: 'error'
    });
    }
  }
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
              size='2xl'
              src={avatar}
            />
            <Text mt={5} fontWeight='600'>{fullname}</Text>
            <Text>{username}</Text>
            <Text color={'gray.600'}>{email}</Text>
          </Container>
        </GridItem>
        <GridItem p={[5, 20]} width={'100%'} display={'flex'} flexDirection={'column'} colSpan={['1', '4']} maxH={['100%', '100dvh']} overflow={'auto'}>
          <NavBar />
          <UpdateAvatarContainer avatar={avatar} setNewAvatar={setNewAvatar}/>
          <EmailContainer email={email} />
          <FormContainer handleSubmit={handleOnSubmit}>
            <SimpleInput size='lg' label={'Full Name'} placeholder={fullname} onChange={e => setNewFullname(e.target.value)} />
            <SimpleInput size='lg' label={'Username'} placeholder={username} onChange={handleOnChangeUsername} />
            {newUsername?.trim().length > 3 && <Text my={2} color={usernameAvailable ? 'green.400' : 'red.400'}>{usernameAvailable ? 'Username is available' : 'Username is not available'}</Text>}
            <PasswordInput onChange={e => setNewPassword(e.target.value)} />
            <Button width={'30%'} isDisabled={spinner} colorScheme='blue' alignSelf={'flex-end'} type='submit'>
              {
                spinner?<Spinner/>:'Update'
              }
            </Button>
          </FormContainer>
        </GridItem>
      </SimpleGrid>
    </Container>
  )
}
