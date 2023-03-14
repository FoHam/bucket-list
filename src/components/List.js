import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';
import Input from './Input';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.boxBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) =>
    completed ? theme.complet : theme.boxText};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'};
`;

const List = ({ item, deleteList, toggleList, updateList }) => {
  const [isEidting, setIsEidting] = useState(false);
  const [text, setText] = useState(item.text);
  const _handleUpdateButtonPress = () => {
    setIsEidting(true);
  };
  const _onSubmitEditing = () => {
    if (isEidting) {
      const editedList = { ...item, ...{ text } }; //Object.assign({}, item, { text });
      setIsEidting(false);
      updateList(editedList);
    }
  };
  const _onBlur = () => {
    if (isEidting) {
      setIsEidting(false);
      setText(item.text);
    }
  };

  return isEidting ? (
    <Input
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={_onSubmitEditing}
      onBlur={_onBlur}
    />
  ) : (
    <Container>
      <IconButton
        type={item.completed ? images.completed : images.uncompleted}
        id={item.id}
        onPressOut={toggleList}
        completed={item.completed}
      />
      <Contents completed={item.completed}>{item.text}</Contents>
      {item.completed || (
        <IconButton
          type={images.update}
          onPressOut={_handleUpdateButtonPress}
        />
      )}
      <IconButton
        type={images.delete}
        id={item.id}
        onPressOut={deleteList}
        completed={item.completed}
      />
    </Container>
  );
};

List.propTypes = {
  item: PropTypes.object.isRequired,
  deleteList: PropTypes.func.isRequired,
  toggleList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
};

export default List;
