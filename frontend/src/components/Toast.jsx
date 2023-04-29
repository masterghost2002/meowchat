import { useToast } from '@chakra-ui/react';
export const CustomToast = () => {
    const toast = useToast();
    // types are: "success", "info", "warning", "error"
    const addToast = (newRes) => {
        toast({
            title: newRes.title,
            description:newRes.message, 
            status: newRes.status, 
            position:"top-right", 
            isClosable: true, 
            duration: 5000,
        })
    }
    
    return { addToast };
}
