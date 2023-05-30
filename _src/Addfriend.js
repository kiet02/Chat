//import liraries
import React, {Component, useEffect, useState} from 'react';
import {FlatList, LogBox} from 'react-native';
import {Image, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {View, Text, StyleSheet, Modal} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const Addfriend = () => {
  const user = auth()?.currentUser;
  const [afriend, setafriend] = useState([]);
  const [info, setinfo] = useState([]);
  let checkconf;
  useEffect(() => {
    database()
      .ref(`users/${user?.uid}/conf`)
      .once('value')
      .then(e => {
        checkconf = Object.values(e.val()).length;
        setafriend;
        for (let key in e.val()) {
          database()
            .ref(`users/${key}`)
            .once('value')
            .then(o => {
              setafriend(pre => [...pre, o.val()]);
            });
          setafriend([...new Set(afriend)]);
        }
      });
  }, [afriend.length > checkconf]);

  const access = item => {
    setafriend(afriend.filter(i => i.uid !== item));
    // console.log(afriend);
    database()
      .ref(`users/${user?.uid}/conf/${item}`)
      .remove()
      .then(
        database().ref(`users/${user?.uid}/friends/${item}`).set({
          uid: item,
        }),
        database().ref(`users/${item}/friends/${user?.uid}`).set({
          uid: item,
        }),
        database().ref(`users/${item}/inv/${user?.uid}`).remove(),
      );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={afriend}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: 390,
                height: 100,
                backgroundColor: 'red',
                marginTop: 10,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: item.photoURL}}
                style={{width: 50, height: 50}}
              />

              <Text>{item.email}</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => access(item.uid)}>
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/fluency/48/000000/checkmark.png',
                    }}
                    style={{width: 50, height: 50}}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/fluency/48/delete-sign.png',
                    }}
                    style={{width: 50, height: 50}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Addfriend;
// export default Addfriend   ;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },
  bottomtop: {
    width: 385,
    height: 50,
    backgroundColor: '#D9D9D9',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
