import React, { useCallback, useState, useEffect } from 'react';
import { StatusBar, Dimensions, Alert } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import List from './components/List';
import Input from './components/Input';

// 전체영역
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.topText};
  align-self: flex-start;
  margin: 0px 20px; /* y축 x축 */
`;

const Index = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

// SplashScreen.hideAsync() 만날때까지 splash 창 보여준다
SplashScreen.preventAutoHideAsync();

const App = () => {
  // 화면 폭 측정
  const width = Dimensions.get('window').width;

  const [newList, setNewList] = useState('');

  const [isReady, setIsReady] = useState(false);

  // 저장소
  const [list, setList] = useState({});

  const _saveList = async list => {
    try {
      await AsyncStorage.setItem('list', JSON.stringify(list));
      setList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const _loadList = async () => {
    try {
      const loadedList = await AsyncStorage.getItem('list');
      setList(JSON.parse(loadedList) || {});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await _loadList();
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  // 컨테이너 새로고침
  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const _addList = () => {
    const ID = Date.now().toString();
    const newListObject = {
      [ID]: { id: ID, text: newList, completed: false },
    };

    setNewList('');
    _saveList({ ...list, ...newListObject });
  };

  const _deleteList = id => {
    const currentList = { ...list };

    Alert.alert('', '삭제하시겠습니까?', [
      {
        text: '아니오',
        onPress() {
          console.log('아니오');
        },
      },
      {
        text: '예',
        onPress() {
          console.log('예');
          delete currentList[id];
          _saveList(currentList);
        },
      },
    ]);
  };

  const _toggleList = id => {
    const currentList = { ...list };
    currentList[id]['completed'] = !currentList[id]['completed'];
    _saveList(currentList);
    currentList[id]['completed'] ? console.log('참') : console.log('거짓');
  };

  const _updateList = item => {
    const currentList = { ...list };
    currentList[item.id] = item;
    _saveList(currentList);
  };

  const _handleTextChange = text => {
    setNewList(text);
    console.log(`변경된문자열:${newList}`);
  };

  const _onBlur = () => {
    setNewList('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        {/* 폰 상태바 */}
        <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
        <Title>Bucket List</Title>
        <Input
          value={newList}
          placeholder="+ Bucket List"
          onChangeText={_handleTextChange} //수정시
          onSubmitEditing={_addList} //완료버튼
          onBlur={_onBlur} //포커스 잃었을때
        />
        <Index width={width}>
          {Object.values(list)
            .reverse()
            .map(item => (
              <List
                key={item.id}
                item={item}
                deleteList={_deleteList}
                toggleList={_toggleList}
                updateList={_updateList}
              />
            ))}
        </Index>
      </Container>
    </ThemeProvider>
  );
};

export default App;
