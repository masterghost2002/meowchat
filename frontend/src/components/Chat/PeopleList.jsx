import React from 'react';
import { Container, Avatar, AvatarBadge, Text, Divider } from '@chakra-ui/react';
import 'animate.css';
const UserInfo = ({ user, setSelectedUser, userId, isSelected }) => {
  if (!userId) return <></>
  return (
    <>
      <Container
        my={2}
        py={2}
        px={2}
        
        backgroundColor={isSelected && '#E2E8F0'}
        _hover={{ cursor: 'pointer', backgroundColor: '#E2E8F0', transition: 'margin-left 2s' }}
        display={'flex'}
        borderRadius={'12'}
        alignItems={'center'}
        style={{ transition: 'all 2s' }}
        onClick={() => setSelectedUser(userId)}
      >
        <Avatar size='md' src={user.avatar}>
          <AvatarBadge boxSize='1.25em' bg={user.isOnline ? 'green.500' : 'gray.500'} />
        </Avatar>
        <Text ml={'5'} color={isSelected ? 'black' : 'gray.600'} fontSize={['20px', '20px', '28px']} >
          {user.username}
        </Text>
      </Container>
      <Divider />
    </>
  )
}
export default function PeopleList({ selectedUser, onlinePeople, setSelectedUser, offlinePeople }) {
  return (
    <Container px={4}  overflowX={'auto'} mt={2} maxH={'90%'} width={'auto'} >
      {Object.keys(onlinePeople).map((userId, index) => {
        return (
          <UserInfo
            key={userId}
            userId={userId}
            user={onlinePeople[userId]}
            setSelectedUser={setSelectedUser}
            isSelected={selectedUser === userId}
          />
        )
      }
      )}
      {Object.keys(offlinePeople).map((userId, index) => {
        if(!userId) return <></>
        return (
          <UserInfo
            key={userId}
            userId={userId}
            user={offlinePeople[userId]}
            setSelectedUser={setSelectedUser}
            isSelected={selectedUser === userId}
          />
        )
      }
      )}
      
    </Container >
  )
}
