import React,{useState,useEffect} from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native'
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
const Dangnhap = ({ navigation }) => {
  const user = auth()?.currentUser;
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [email,setemail]= useState('')
  const [pass,setpass]= useState('')
  const [token,settoken] = useState()

useEffect(()=>{
  requestUserPermission();
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFCM();
    }
  }

  const getFCM = async () => {
    let fcm = await AsyncStorage.getItem('fcm');
    console.log(fcm);
    settoken(fcm);

    if (!fcm) {
      try {
        const token = await messaging().getToken();
        console.log('new token', token);
        if (token) {
          await AsyncStorage.setItem('fcm', token);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log('ssssswdw',typeof token);
})

const handl=()=>{
  auth()
  .signInWithEmailAndPassword(email, pass)
  .then(() => {
  
    console.log('thanh cong');
    if(toggleCheckBox){
      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('pass', pass);
      console.log('Logged in as: ' + email);
      
    }navigation.replace('Home')
    setTimeout(() => {
       const user = auth()?.currentUser;
    database().ref(`/users/${user?.uid}/token`)
    .set({
      token : token,
    })
    .then(() => console.log(user?.uid));
    }, 100);
   
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
}
  

  return (
    <View style={styles.main}>
      <View style={{width:"100%",height:300}} >
         <Image source={(require('./Anh/sep.png'))} 
         style={styles.photo}/>
      </View>
      <View style={{width:"100%",height:250,alignItems:'center',}}>
        
        <TextInput style={styles.textinput} placeholder='Tài khoản' onChangeText={(e)=>{setemail(e)}}/>
        <TextInput style={styles.textinput} placeholder='Mật khẩu' onChangeText={(e)=>{setpass(e)}}/>

        <View style={styles.checkbox}>  
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={() => {setToggleCheckBox(!toggleCheckBox)}}
        />
        <Text>Tự động đăng nhập</Text>
        </View>
      
        <TouchableOpacity style={styles.button} onPress={()=>{handl()}}>
          <Text style={{fontWeight:"bold"}}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop:10}} onPress={()=>{navigation.navigate("Dangky")}}> 
          <Text>Đăng ký</Text>
        </TouchableOpacity>
    
      </View>

      <View style={{width:"100%",height:200,marginTop:30}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',marginTop:30}}>
          <View style={{width:80,height:2, backgroundColor:'black'}}></View>
          <Text style={{fontWeight:'bold',color:'black',fontSize:17}}>Hoặc</Text>
          <View style={{width:80,height:2, backgroundColor:'black'}}></View>
          
        </View>

        <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:30}}>
          <TouchableOpacity> 
            <Image source={require('./Anh/facebook.png')}/>
          </TouchableOpacity>
         
          <TouchableOpacity>
            <Image source={require('./Anh/google.png')}/>
          </TouchableOpacity>

        </View>
     
      </View>
    
      
    </View>
  )
}

export default Dangnhap

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
      marginTop:10,
    },
    checkbox:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    },
})