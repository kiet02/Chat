//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Button} from '@rneui/base';

import messaging from '@react-native-firebase/messaging';

// create a component
const Addgroup = ({navigation}) => {
  const [valu, setvalu] = useState([]);
  const [dataFromState, setDatas] = useState('');
  const [hiddenItems, setHiddenItems] = useState([]);
  const [sreach,setsreach] = useState([]) 
  const [add, setadd] = useState([]);
  const uids =
    Math.random().toString(36).substring(2) + Date.now().toString(36);
  let sreachData = [];
  const user = auth()?.currentUser;

  useEffect(() => {
    database()
      .ref(`users/${user?.uid}/friends`)
      .once('value')
      .then(e => {
        const o = Object.values(e.val());
        setvalu(o);
        console.log(valu);

      });
valu.map((e) => {
  database().ref(`users/${e.uid}`).once('value').then((e)=>{
      setsreach((pre) => [...pre,e.val()])
  })
})


  }, [valu.length > 0]);
try {
  sreachData = sreach.filter(user => user.name.includes(dataFromState));
} catch (error) {
 console.log(error); 
 
}

  const handleItemClick = itemId => {
    const {name, photoURL, uid} = itemId;
    setHiddenItems(prevHiddenItems => [...prevHiddenItems, uid]);
    setadd(pre => [...pre, itemId]);
    console.log('====', hiddenItems);
  };

  const handlecancle = item => {
    const {name, photoURL, uid} = item;
    setadd(add.filter(i => i.uid !== item.uid)),
      setHiddenItems(hiddenItems.filter(i => i !== uid));
    setTimeout(() => {
      console.log('sss', hiddenItems);
    }, 1000);
  };

  const upGroup = () => {
    if (hiddenItems.length > 0) {
      hiddenItems.map(e => {
        database().ref(`chats/${e}/${uids}`).set({
          __id: uids,
        });

        database().ref(`chats/${user.uid}/${uids}`).set({
          __id: uids,
        });

        database()
          .ref(`users/${uids}`)
          .set({
            email: uids,
            nameG: `group `,
            photoURL: 'https://img.icons8.com/color/48/people-skin-type-7.png',
            uid: uids,
          })
          .then(console.log('ok'));

        database().ref(`group/${uids}/${e}`).set({_id: e}).then(console.log('ok'));
        database().ref(`group/${uids}/${user.uid}`).set({_id: e}).then(() => {
            setadd([]);
            setHiddenItems([]);
            messaging().subscribeToTopic(`${uids}`)

          });
      });

    } else {
      console.log('them it nhat mot thanh vien');
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#DDDFE0',
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
          }}>
          <Image
            source={require('./Anh/search.png')}
            style={{width: 30, height: 30}}
          />
        </View>

        <TextInput
          style={{
            width: 335,
            height: 50,
            backgroundColor: 'white',
            borderTopRightRadius: 20,
          }}
          placeholder="Search"
          onChangeText={text => {
            setDatas(text);
          }}></TextInput>
      </View>

      {add.length > 0 ? (
        <View style={{width: '100%', height: 100, marginTop: 10}}>
          <FlatList
            data={add}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 100,
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => handlecancle(item)}>
                  <Image
                    source={{uri: item.photoURL}}
                    style={{width: 80, height: 80}}
                  />
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}

      <FlatList
        data={sreachData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          // const {index} = false
          if (hiddenItems.includes(item.uid)) {
            return null; // Ẩn mục nếu nó nằm trong danh sách hiddenItem
          } else {
            if (item?.email != user.email) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Chat', {
                      name: item.name,
                      email: item.email,
                      photo: item.photoURL,
                      uid: item.uid,
                    });
                  }}>
                  <View
                    style={{
                      width: 380,
                      height: 100,
                      backgroundColor: 'red',
                      marginTop: 10,
                      alignSelf: 'center',
                      borderRadius: 20,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={{uri: item.photoURL}}
                        style={{width: 50, height: 50, marginLeft: 10}}></Image>
                      <Text style={{marginLeft: 10}}>{item.name}</Text>
                    </View>

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleItemClick(item);
                        }}>
                        <Image
                          source={{
                            uri: 'https://img.icons8.com/pastel-glyph/64/plus--v1.png',
                          }}
                          style={{width: 50, height: 50, marginRight: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          }
        }}
      />
      {add.length > 0 ? (
        <Button title={'ok'} onPress={upGroup} style={{}} />
      ) : null}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default Addgroup;
