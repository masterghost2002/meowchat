import { Container, Image,Box } from '@chakra-ui/react'
import 'animate.css';
export default function LogoSplash() {
    return (
        <Container maxW={'100%'} minH={'100dvh'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
            <Box boxSize='xs' className='animate__animated animate__zoomIn'>
                <Image 
                    src={'https://cdn3d.iconscout.com/3d/premium/thumb/lovely-cat-4949421-4127167.png'}
                    alt='Dan Abramov' 
                    className='animate__animated animate__animated'
                />
            </Box>
        </Container>
    )
}
