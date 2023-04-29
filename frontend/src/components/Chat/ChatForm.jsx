import React, {useState} from 'react';
import { Container, Input, IconButton, HStack} from '@chakra-ui/react';
import FormContainer from '../Form/FormContainer';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import { TiAttachment } from 'react-icons/ti';

export default function ChatForm({ setNewMessage, newMessage,sendMessage, sendFile }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const handleAttachFile = ()=>{
    document.getElementById('getFile').click();
  }
  return (
    <>
    <Container maxWidth={'100%'} p={5} position={'relative'} bottom={0}>
      {showEmoji && <EmojiPicker width={'100%'} onEmojiClick={(e)=>setNewMessage(prev=>prev+" "+e.emoji)}/>}
      <FormContainer handleSubmit = {sendMessage}>
        <HStack>
          <Container display={'flex'} p={0} alignItems={'center'} maxWidth={'100%'} bg='white'
            borderRadius={'20px'}>
          <IconButton icon={<BsEmojiSmile size={28}/>} bg={'transparent'} _hover={{backgroundColor:"white"}} onClick={()=>setShowEmoji(prev=>!prev)}/>
          <Input
            type='text'
            placeholder='Type your message here'
            size={'lg'}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            borderRadius={'inherit'}
            border={'none'}
          />
          </Container>
          <IconButton
            variant='solid'
            colorScheme='blue'
            aria-label='Call Sage'
            fontSize='20px'
            borderRadius={'20px'}
            onClick={handleAttachFile}
            p={'2'}
            icon={<TiAttachment size={'28px'}/>}
          >
          </IconButton>
          <Input type='file' id="getFile" style={{display:'none'}} onChange={(e)=>sendFile(e)}/>
          <IconButton
            variant='solid'
            colorScheme='blue'
            aria-label='Call Sage'
            fontSize='20px'
            borderRadius={'20px'}
            type='submit'
            onClick={()=>setShowEmoji(false)}
            p={'2'}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            }
          />
        </HStack>
      </FormContainer>
    </Container>
    </>
  )
}
