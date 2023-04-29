import { Select } from '@chakra-ui/react';
import PropTypes from 'prop-types';
export default function SelectForm(props) {
    return (
        <Select name={props.name} placeholder={props.placeholder} width={props.width} variant='filled' onChange={props.onSelect}>
            {props.options.map((item, index)=><option key={index} value={item.label}>{item.label} </option>)}
        </Select>
    )
};
SelectForm.propTypes = {
    placeholder: PropTypes.string,
    with:PropTypes.array,
    onSelect:PropTypes.func,
    option:PropTypes.array
}
SelectForm.defaultProps = {
    name:'searchBy',
    placeholder: 'Select',
    with:['sm', 'md'],
    option:[{label:'Option 1'}, {label:'Option 2'}]
}
