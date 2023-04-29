import { FormControl, InputGroup, Input, InputRightElement, Button , FormLabel} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from "react";
import PropTypes from 'prop-types';
export default function PasswordInput(props) {
    const [viewPassword, setViewPassword] = useState(false);
    return (
        <FormControl  isInvalid = {props.isInvalid}>
            <FormLabel fontWeight='bold'>{props.label}</FormLabel>
            <InputGroup mb={4}  >
                <Input size='lg' type={viewPassword ? 'text' : 'password'} variant={props.variant} name = {props.name} onChange = {props.onChange} placeholder = {props.placeholder}></Input>
                <InputRightElement width='4.5rem' m={1}>
                   {props.viewButton && <Button h='100%' size='lg' variant='ghost' onClick={() => setViewPassword((prevState) => !prevState)}>
                        {viewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>}
                </InputRightElement>
            </InputGroup>
        </FormControl>
    )
};
PasswordInput.propTypes = {
    name: PropTypes.string,
    viewButton: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    variant: PropTypes.string,
    onChange: PropTypes.func ,
    placeholder: PropTypes.string,
    isInvalid:PropTypes.bool
  };
PasswordInput.defaultProps = {
    placeholder: 'Password',
    variant: 'filled',
    label: 'Password',
    id: 'floatingPassword',
    viewButton: true,
    disabled: false,
    isInvalid:false
  };
