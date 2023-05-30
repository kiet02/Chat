import React, {useState, useEffect} from 'react';
import {
  View,
 StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/themed';
import {Text} from '@rneui/base';
import database from '@react-native-firebase/database';
import Addfriend from './Addfriend';

const Home = ({navigation}) => {
  const user = auth()?.currentUser;
  const [dataFromState, setDatas] = useState('');
  const [modal, setmodal] = useState(false);
  const [fri, setfri] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [onchat, setonchat] = useState([]);
  const [valu, setvalu] = useState([]);
  const [check, setcheck] = useState(true);
  const uids = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const [add, setadd] = useState([]);
  const [loc, setloc] = useState([]);
  let sreachData = [];
  useEffect(() => {
    database()
      .ref('users')
      .once('value')
      .then(e => {
        const o = Object.values(e.val());
        setvalu(o);
      });

    database()
      .ref(`users/${user?.uid}/friends`)
      .once('value')
      .then(snapshot => {
        
  var friend = []

        for (let key in snapshot.val()) {
          setloc(pre => [...pre, key]);

          database()
            .ref(`users/${key}`)
            .once('value')
            .then(e => {
              if(!fri.includes(e.val())){
              
                friend.push(e.val())
                setfri(friend);

              }
            });
        }
      });
    // setfri([...new Set(fri)]);

    database()
      .ref(`chats/${user?.uid}`)
      .once('value')
      .then(doc => {
  var om = [];

        for (let key in doc.val()) {
          database()
            .ref(`users/${key}`)
            .once('value')
            .then(e => {
              om.push(e.val());
              setonchat(om);
            });
        }
      });

    database()
      .ref(`users/${user?.uid}/conf`)
      .once('value')
      .then(snap => {
        for (let key in snap.val()) {
          setadd(e => [...e, key]);
        }
      });

  
  }, [fri != null]);

  if (dataFromState.length > 0) {
    try{
      sreachData = valu.filter(user => user.email.includes(dataFromState));
    }
    catch(error){console.log(error);
    }
  }
console.log(valu);

  const Hanld = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    AsyncStorage.removeItem('email');
    AsyncStorage.removeItem('pass');
    console.log('Logged out');
    navigation.replace("Dangnhap");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      database()
      .ref(`users/${user?.uid}/friends`)
      .once('value')
      .then(snapshot => {
        if(snapshot.exists()){
          var friend = []

        for (let key in snapshot.val()) {
          setloc(pre => [...pre, key]);

          database()
            .ref(`users/${key}`)
            .once('value')
            .then(e => {
              if(!fri.includes(e.val())){
              
                friend.push(e.val())
                setfri(friend);

              }
            });
        }
        }else{
          setfri([]);
        }
  
      });
    }, 1000);
  }, []);

  const addfriend = uid => {
    {
      add.includes(uid)
        ? database()
            .ref(`users/${user?.uid}/conf/${uid}`)
            .remove()
            .then(
              console.log('xoa thanh cong'),
              database().ref(`users/${uid}/conf/${user?.uid}`).remove(),

              setadd(add.filter(e => e !== uid)),
            )
        : database()
            .ref(`users/${user?.uid}/inv/${uid}`)
            .set({
              uid: uid,
            })
            .then(
              database().ref(`users/${uid}/conf/${user?.uid}`).set({uid: uid}),
              console.log('gui loi moi ket ban'),
              setadd(e => [...e, uid]),
            );
    }
    console.log(add);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#709876', alignItems: 'center'}}>
      <Modal
        animationType="slide"
        onRequestClose={() => {
          setmodal(false);
          setDatas('');
        }}
        visible={modal}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setmodal(true)}>
            <Image
              source={require('./Anh/search.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>

          <TextInput
            style={{width: 335, height: 50, backgroundColor: 'white'}}
            placeholder="Search"
            onChangeText={text => {
              setDatas(text);
            }}></TextInput>
        </View>

        <FlatList
          data={sreachData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            
            
            if (item?.email != user.email) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Chat', {
                      name: item.name,
                      email: item.email,
                      photo: item.photoURL,
                      uid: item.uid,
                      token: item?.token?.token
                    });
                    console.log(item);
                  }}>
                  <View
                    style={{
                      width: '90%',
                      backgroundColor: 'red',
                      height: 100,
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
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {loc.includes(item.uid) ? null : (
                        <TouchableOpacity onPress={() => addfriend(item.uid)}>
                          {add.includes(item.uid) ? (
                            <Image
                              source={{
                                uri: 'https://img.icons8.com/fluency/48/delete-sign.png',
                              }}
                              style={{width: 50, height: 50}}
                            />
                          ) : (
                            <Image
                              source={{
                                uri: 'https://img.icons8.com/fluency/48/000000/checkmark.png',
                              }}
                              style={{width: 50, height: 50}}
                            />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
        />
      </Modal>

      <View style={styles.top}>
        <View style={styles.ontop}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{borderRadius: 100, height: 70, width: 70, elevation: 20}}>
              <TouchableOpacity onPress={() => console.log(uids)}>
                <Image
                  source={{uri: user?.photoURL}}
                  style={{width: 70, height: 70, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </View>
            <View style={{marginLeft: 5}}>
              <Text>{user?.displayName}</Text>
              <Text>{user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              Hanld();
            }}>
            <Image
              style={{width: 40, height: 40, borderRadius: 100}}
              source={require('./Anh/logout.png')}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomtop}>
          <TouchableOpacity
            onPress={() => {
              setmodal(!modal);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('./Anh/search.png')}
              style={{width: 30, height: 30}}
            />
            <Text
              style={{
                width: 335,
                height: 40,
                backgroundColor: 'white',
                textAlignVertical: 'center',
                textAlign: 'auto',
              }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: 40,
          backgroundColor: 'blue',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setcheck(true)}>
          <Text>nhắn tin</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setcheck(false)}>
          <Text>Lời mời kết bạn</Text>
        </TouchableOpacity>
      </View>

      {check ? (
        <View style={{width: '100%'}}>
          <View
            style={{
              backgroundColor: '#668D66',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 10,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Addgroup')}>
              <Image
                source={{uri: 'https://img.icons8.com/dotty/80/add.png'}}
                style={{width: 70, height: 70, marginLeft: 10}}
              />
            </TouchableOpacity>

            <FlatList
              data={fri}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                
                if (fri.includes(item?.uid)) {
                  return null;
                } else {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginLeft: 10,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Chat', {
                            name: item?.name,
                            email: item?.email,
                            photo: item?.photoURL,
                            uid: item?.uid,
                            token: item?.token?.token
                          });
                        }}>
                        <Image
                          source={{uri: item?.photoURL}}
                          style={{width: 70, height: 70}}></Image>
                      </TouchableOpacity>
                      <Text>{item?.name}</Text>
                    </View>
                  );
                }
              }}
            />
          </View>

          <View style={{height: 460}}>
            <FlatList
              data={onchat}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item, index}) => {
                // console.log(index);

                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Chat', {
                        name: item?.name,
                        email: item?.email,
                        photo: item?.photoURL,
                        uid: item?.uid,
                        token: item?.token?.token
                      });
                    }}
                    style={{
                      width: '90%',
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      marginTop: 10,
                      height: 90,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 15,
                    }}>
                    <Image
                      source={{uri: item?.photoURL}}
                      style={{width: 60, height: 60, margin: 10}}
                    />
                    <Text>{item?.email}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      ) : (
        <Addfriend />
      )}
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  top: {
    backgroundColor: '#555481',
    height: 152,
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ontop: {
    width: 385,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  friend: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  chat: {
    width: 385,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 20,
  },
});
