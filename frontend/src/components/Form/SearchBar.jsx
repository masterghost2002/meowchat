import React from 'react';
import PropTypes from 'prop-types';
import {
    InputGroup,
    InputLeftAddon,
    Input
} from '@chakra-ui/react';
export default function SearchBar(props) {
    return (
        <InputGroup width={['100%', 'md']}>
            <InputLeftAddon children={props.children}  p={0} bg='transparent'></InputLeftAddon>
            <Input type='text' placeholder={props.placeholder} onChange = {props.onChange} name={props.name} variant={props.variant} />
        </InputGroup>
    )
};
SearchBar.prototype = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    variant:PropTypes.string
}
SearchBar.defaultProps = {
    placeholder: 'Search Blog',
    name: 'searchInput',
    variant: 'filled'
}
