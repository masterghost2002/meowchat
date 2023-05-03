import React from 'react';
import { HStack, PinInput, PinInputField, FormLabel } from '@chakra-ui/react';
export default function OTPInput({setOTP, isInvalid}) {

    return (
        <>
        <FormLabel>OTP</FormLabel>
        <HStack >
            <PinInput  onChange={setOTP} isInvalid={isInvalid} name='OTP'>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
        </HStack>
        </>
    )
}
