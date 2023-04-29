import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import PropTypes from 'prop-types';
export default function SimpleInput(props) {
    return (
        <FormControl mb={4} isInvalid={props.isInvalid}>
            <FormLabel fontWeight={'bold'}>{props.label}</FormLabel>
            <Input isRequired={props.isRequired} disabled = {props.disabled} type = {props.type} name={props.name} onChange = {props.onChange} placeholder = {props.placeholder} value={props.defaultValue} size={props.size} variant={props.variant}></Input>
        </FormControl>
    )
}
SimpleInput.propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.string,
    isRequired: PropTypes.bool
  };
SimpleInput.defaultProps = {
    name: 'name',
    label: 'simple input',
    type: 'text',
    size: 'sm',
    variant: 'filled',
    disabled: false,
    isRequired: false
};