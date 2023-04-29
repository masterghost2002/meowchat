import React , {useContext} from 'react'
import { MenuButton, Menu, MenuList, MenuItem, Button, Avatar, Box, Text, Link as ChakraLink}  from '@chakra-ui/react';
import { CiMenuKebab } from 'react-icons/ci';
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';
export default function menu({handleLogout}) {
  const { avatar, fullname} = useContext(UserContext);
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<CiMenuKebab size={'30px'}/>} background={'transparent'} _hover={{background:'transparent'}}></MenuButton>
      <MenuList>
        <MenuItem bg='white'>
            <Box display={'flex'} alignItems={'center'}>
            <Avatar size='xl' name='Ryan Florence' src={avatar} />
            <Text fontSize={'24px'} ml='2' fw='500'>{fullname}</Text>
            </Box>
        </MenuItem> 
        <MenuItem><ChakraLink as={Link} to='/profile'>Profile Setting</ChakraLink></MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
