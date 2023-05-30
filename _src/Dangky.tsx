import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Dangky = ({navigation}) => {
    const [tk,settk]= useState('')
    const [mk,setmk]= useState('')
    const [mk2,setmk2]= useState('')
    const [user, setUser] = useState(null);

  const writeRT =()=>{
    database()
  .ref(`/users/${user?.uid}`)
  .set({
    name : user?.displayName,
    email : user?.email,
    uid : user?.uid
  })
  .then(() => console.log('Data set.'));
  }


  const write =()=>{
    const subscriber = auth().onAuthStateChanged((e) => setUser(e));
  
  }
    const dangky=()=>{
        if(tk != ' ' && mk.length >= 6  && mk2 == mk){
            auth()
  .createUserWithEmailAndPassword(tk, mk)
  .then(() => {
    console.log('User account created & signed in!');
    write()
    setTimeout(() => {
       writeRT()
    }, 1000);
   
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });
        navigation.navigate('Dktt',{email:tk,pass:mk})
        }
    
        
    }
    

  return (
    <View style={styles.main}>
   <Image source={(require('./Anh/sep.png'))} 
         style={styles.photo}/>
         <View style={{width:"100%",height:250,alignItems:'center',}}>
        
        <TextInput onChangeText={(text)=>{settk(text)}} style={styles.textinput} placeholder='Tài khoản'/>
        <TextInput onChangeText={(text)=>{setmk(text)}}  style={styles.textinput} placeholder='Mật khẩu' />
        <TextInput onChangeText={(text)=>{setmk2(text)}}  style={styles.textinput} placeholder='Nhập lại mật khẩu' />

        <TouchableOpacity style={styles.button} onPress={()=>{dangky()}}>
          <Text style={{fontWeight:"bold"}}>Đăng Ký</Text>
        </TouchableOpacity>

        
    
      </View>
    </View>
  )
}

export default Dangky

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor:'#709876',
        
    },
    photo:{
      width:280,
      height:280,
      alignSelf:'center',
    },
    textinput:{
        backgroundColor:'#D9D9D9',
        width:290,
        height:63,
        borderRadius:20,
        alignItems:'center',
        marginTop:20,
        textAlign:'center'
    },
    button:{
      borderRadius:20,
      width:189,
      height:42,
      backgroundColor:"red",
      alignItems:'center',
      justifyContent: 'center',
      marginTop:20,
    },
})