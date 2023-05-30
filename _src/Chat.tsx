import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useState, useRef,useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import database, {firebase} from '@react-native-firebase/database';
import { launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { InputToolbar} from 'react-native-gifted-chat';
import Notification from '../Notification';
import messaging from '@react-native-firebase/messaging';

export default function Chat({route, navigation}) {
  const [msg,setmsg] = useState()
  const {name, email, photo, uid,token} = route.params;
  const [messages, setMessages] = useState([]);
  const [uri, seturi] = useState('');
  const [filename, setfilename] = useState('');
  const [img,setimg] = useState('')
  const [check,setcheck] = useState(false)
  const [group,setgroup] = useState([])
  const user = auth()?.currentUser;
  const uids =Math.random().toString(36).substring(2) + Date.now().toString(36);
  const userid = user?.uid
  useEffect(() => {
    console.log(token);
 
    const unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
 
    database().ref(`group/${uid}`).once('value').then((e)=>{
        for(let key in e.val()){
            setgroup((pre) => [...pre,key])
          
          
        }
          
    }).catch(e => console.log(e)    )

      firestore()
      .doc(`chats/${uid}`)
      .collection(`${userid}`).orderBy('createdAt','desc')
      .onSnapshot(e =>
        {
          setMessages(
            e.docs.map(ms => ({
              _id: ms.data()._id,
              createdAt: ms.data().createdAt.toDate(),
              text: ms.data().text,
              user: ms.data().user,
              image: ms?.data().img
            })),
          
          )
        }
        )
        return unsubscribe;
  }, []);

  function selectImage() {
    const options = {
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        response.assets?.map(e => {
          setfilename(e.fileName);
          seturi(e.uri);
          Putfile()
          setcheck(true)
        });
      }
    });
  }
  // đẩy lên realtime và firestore
  const Putfile = async () => {
 
      const uploadTask = storage().ref(`/images/${filename}`).putFile(`${uri}`);
      uploadTask.on(
        'state_changed',
        snapshot => {
          console.log(snapshot.bytesTransferred);
        },
        error => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);
           setimg(downloadURL)
           console.log(img);
           
            setcheck(false)
            // console.log(ims);
           
          });
        },
      );
   
  };

  console.log(group);
const onSend = () => {
  const message ={
    _id : uids,
    createdAt : new Date(),
    text : msg,
    user : {_id :userid}
  }
  
  if(group.length > 0){
    group.map((e) => {
    firestore().doc(`chats/${uid}`).collection(`${e}`).add(message);
    setimg('')
    setmsg('')
    group.map(e => console.log(e)
    )
  })
  }else{
    //  chat chinh
    if(message.text != '' || img != ''){
    firestore().doc(`chats/${userid}`).collection(`${uid}`).add(message);
    firestore().doc(`chats/${uid}`).collection(`${userid}`).add(message);
    //them vao danh sach chat
    database().ref(`chats/${uid}/${userid}`).set(message);
    database().ref(`chats/${userid}/${uid}`).set(message);
    console.log(img);
    notification(message)
  
  }
    setimg('')
    setmsg('')
    // add()
  }}

  async function notification(data) {

    const notification = {
      title :'New message',
      body : data.text ,
      token : token
  }
  await Notification.Sendnotifi(notification)
  
  }

  // xóa tin nhắn
  const dele = uids => {
    firestore()
      .doc(`chats/${user?.uid}`)
      .collection(`${uid}`)
      .where('_id', '==', `${uids}`)
      .onSnapshot(doc => {
        doc.docs.map(ms =>
          firestore().doc(`chats/${user?.uid}/${uid}/${ms?.id}`).delete(),
        );
      });

    firestore()
      .doc(`chats/${uid}`)
      .collection(`${user?.uid}`)
      .where('_id', '==', `${uids}`)
      .onSnapshot(doc => {
        doc.docs.map(ms =>
          firestore().doc(`chats/${uid}/${user?.uid}/${ms?.id}`).delete(),
        );
      });
  };

  // thông báo xóa tin nhắn
  const handlePress = uids => {
    // {item == user.uid ?
    Alert.alert(
      'Title',
      'Xoa doan tin nhan',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dele(uids);
          },
        },
      ],
      {cancelable: false},
    );
    // : null}
    console.log(uids);
  };
  return (
    <View style={{flex:1,backgroundColor:'#709876'}}>
    <GiftedChat
    alwaysShowSend={true}
    messages={messages}
    showAvatarForEveryMessage={true}
  // onSend={messages =>{onSend(messages)}}
    // bottomOffset={90}
    user={{
      _id: userid,

    }}
    maxComposerHeight={200}
    //phần nhắn tin
    renderInputToolbar ={(props)=>{
          const { text, onTextChanged } = props;
        return(
          <View style={{height:45}}>
              <InputToolbar
              {...props}
              containerStyle={{justifyContent:'space-around',alignItems:'stretch',backgroundColor:"#347045",height:60}}
              renderComposer={(props)=>{
                return(
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:60}}>
                <TouchableOpacity onPress={()=> selectImage()}>
                  <Image  source={{
                    uri: 'https://img.icons8.com/ios-glyphs/30/null/image.png',
                  }} style={{width: 40,height: 40,margin:5}}></Image> 
                </TouchableOpacity>
                  <TextInput 
                  value={msg}
                  placeholder='Nhập tin nhắn'
                  onChangeText={e => setmsg(e)}
                  style={{width:310,height:50,borderRadius:15,backgroundColor:'white'}}
                  />
            </View>
            )
                }}
      
              renderSend={(e)=>{
                return(
                <Send
                {...e}
                  // containerStyle={{height:60,justifyContent:'center'}}
                >
                  <TouchableOpacity onPress={onSend}>
                  <Image source={require('./Anh/send.png')} style={{width: 35,height: 35,margin:10}}/>
                </TouchableOpacity>
                </Send>
                )
              }}
      />

    
      
      </View>
     )
     
    }}

    onLongPress={(context, message) =>handlePress(message._id)
    }
  
    renderFooter={()=>{
      if(check){
        return(
        <View style={{width:'100%',height:100,backgroundColor:'#709876',alignItems:'flex-end'}}>
          {/* <Image source={{uri: img}} style={{width:100,height: 100,}}/> */}
          <View style={{width:100,height: 100,justifyContent:'center',alignItems:'center',backgroundColor:'#7D7D7D'}}> 
          <ActivityIndicator size="large"/>
          </View>
          </View>
      )
      }else if(check == false && img != '' ){
        return(
        <View style={{width:'100%',height:100,backgroundColor:'#709876',alignItems:'flex-end'}}>
        <Image source={{uri: img}} style={{width:100,height: 100,}}/>
        </View>)
      }else{
        return(
          <View style ={{ width:10,height:20}}/>
        )
      }
      
    }}
    //khi không có tin nhắn
    renderChatEmpty={() =>{
      return(
        <View style={{ backgroundColor: '#709876', flex: 1,justifyContent:'center',alignItems:'center' }} >
          <Text style={{transform:[{scaleY:-1}]}}>Nhắn tin ngay</Text>
        </View>
      )
    }}

  

  />
  </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#709876',
  },
  khung: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
  nham: {
    width: 300,
    height: 40,
    backgroundColor: 'white',
    marginLeft: 10,
    borderRadius: 20,
  },
});
