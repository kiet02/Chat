import React,{useEffect,useState} from 'react'
import {View,StyleSheet,Image,ActivityIndicator} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const Auto = ({navigation}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        AsyncStorage.getItem('email').then((value) => {
          if (value !== null) {
            console.log('Logged in as: ' + value);
            setTimeout(() => {
                navigation.replace('Home')
            }, 1000);
            
          } else {
            console.log('Not logged in');
            setTimeout(() => {
                navigation.replace("Dangnhap")
            }, 1000);
            
          }
        });
        const subscriber = auth().onAuthStateChanged((user) => {
          setUser(user);
        });
      }, []);
      console.log(user);
      
  return (
    <View style={styles.main}>
            <View style={{width:"100%",height:300}} >
         <Image source={(require('./Anh/sep.png'))} 
         style={styles.photo}/>
         
      </View>
      <ActivityIndicator size="large" color="#5c7d6b" />
    </View>
  )
}

export default Auto

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor:'#709876',
        justifyContent:'center',
        alignItems:'center'
    },
    photo:{
        width:280,
        height:280,
        alignSelf:'center',
      },
})