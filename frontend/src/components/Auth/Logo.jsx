import React from 'react';
import { Heading, Container } from '@chakra-ui/react';

export default function Logo({size}) {
  return (
    <Container display={'flex'} p={0} >
        <Heading color='blue.400'>Meow-</Heading>
        <Heading>Chat</Heading>
    </Container>
  )
}
