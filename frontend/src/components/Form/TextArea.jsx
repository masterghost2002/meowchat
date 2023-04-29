import { FormLabel, FormControl, Textarea } from "@chakra-ui/react";
import PropTypes from 'prop-types';
export default function TextArea(props) {
  return (
    <FormControl mb={4}>
          <FormLabel fontWeight={'bold'}>{props.label}</FormLabel>
          <Textarea placeholder={props.placeholder} name={props.name} onChange={props.onChange} variant={props.variant} size='md'></Textarea>
    </FormControl>
  )
};
TextArea.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange:PropTypes.func,
    name: PropTypes.string,
    variant: PropTypes.string
}
TextArea.defaultProps = {
    label: 'Message',
    placeholder: 'Write your query ...',
    name:'message',
    variant: 'filled'
}