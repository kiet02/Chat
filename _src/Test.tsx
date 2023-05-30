//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button,KeyboardAvoidingView, Image, FlatList,TextInput,PermissionsAndroid,Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Sendnotifi from '../Notification';  
import Notification from '../Notification';
const Test = () => {
   
    const [token,settoken] = useState()
    // messaging().getIsHeadless
useEffect(()=>{
    requestUserPermission()
 const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });
   
  
    return unsubscribe;
})
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
         getFCM()
          
        }
      }

      const getFCM = async()=>{
        let fcm = await AsyncStorage.getItem('fcm')
        console.log(fcm)
        settoken(fcm)

        if(!fcm){
            try {
                const token = await messaging().getToken()
                console.log('new token',token)
                if(token){
                    await AsyncStorage.setItem('fcm',token)
                }
            } catch (error) {
                console.log(error);
                
            }
        }
      }
    
  async function Displaynotification() {
    const notification = {
        title :'ok',
        body : 'okk',
        token :'dUyYd9M7TAyFEiiwgpks4B:APA91bEErpyJ1ctgWwM4LgfJhjw_eOV9H22z6Yz-1ErJ9-MuC3z3YwwxlTM9eC86vSHq7yg94mD8IDejROEGpeiIuOxJEfqn-4Z0k7a1lKJWvvrZi8DWRGuvWCjXHCD4K2cl9wReTGl3'
    }
    await Notification.Sendnotifi(notification)
    
  }
    
    return (
        <View style={styles.container}>
            <Text>Test</Text>
            <Text>{token}</Text>
          <Button title='ok' onPress={Displaynotification}/>

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
export default Test;
