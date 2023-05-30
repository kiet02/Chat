//import liraries
import React, { Component,useState,useEffect } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableOpacity,Image } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';



const Dktt = ({navigation}) => {
    // const {email,pass} = route.params;
    const [ten,setten]= useState('')
    const [ten1,setten1]= useState('')
    const [uri, seturi] = useState('');
    const [img,setimg] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png')
    const [user, setUser] = useState(null);
    const [filename, setfilename] = useState('');

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
          setUser(user);
          setten(user?.email)
        });

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
            });
          }
        });
      }
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
             
              // console.log(ims);
             
            });
          },
        );
     
    };
    const write =()=>{
       database()
      .ref(`/users/${user?.uid}`)
      .set({
        name : ten,
        email : user?.email,
        photoURL:img,
        uid: user?.uid,
        token:{
          token:''
        }
      })
      .then(() => {console.log('Data set.'),console.log(user);})
      // database().ref(`/users/${user?.uid}/friends`).set({friend:''}).then(() => {console.log('Data set.'),console.log(user);})
      
      if(ten1.length > 0){navigation.navigate("Dangnhap")}
      }

      const handleSaveProfile = async () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
          try {
            await currentUser.updateProfile({
              displayName:ten,
              photoURL:img
            });
            console.log('Profile updated successfully!');
          } catch (error) {
            console.log('Error updating profile: ', error);
          }
        }
      };

   
       
     
    
    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={selectImage}>
             <Image source={{uri:img}} 
         style={styles.photo}/>
          </TouchableOpacity>
           
         <View style={{width:"100%",height:250,alignItems:'center',}}>
        <TextInput onChangeText={(text)=>{setten(text),setten1(text)}}  style={styles.textinput} placeholder='Tên' />
        <TouchableOpacity style={styles.button} onPress={()=>{handleSaveProfile(),write()}}>
          <Text style={{fontWeight:"bold"}}>Đăng Ký</Text>
        </TouchableOpacity>

        
    
      </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#709876',

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
      photo:{
        width:280,
        height:280,
        alignSelf:'center',
        borderRadius:1000,
      },
});

//make this component available to the app
export default Dktt;
