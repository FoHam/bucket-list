import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.topBoxText,
}))`
  width: ${({ width }) => width - 40}px;
  height: 70px;
  margin: 3px 0;
  padding: 15px 40px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.boxBackground};
  font-size: 25px;
  color: ${({ theme }) => theme.topBoxText};
`;

const Input = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
}) => {
  const width = Dimensions.get('window').width;

  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLength={50}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      // secureTextEntry={true} 입력문자 보호
      // multiline={true}  여러줄입력
      onChangeText={onChangeText}
      value={value}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
    />
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Input;
