// In App.js in a new project

import * as React from 'react';
import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dangnhap from './_src/Dangnhap';
import Dangky from './_src/Dangky';
import Home from './_src/Home';
import Auto from './_src/Auto';
import Chat from './_src/Chat';
import Dktt from './_src/Dktt';
import Test from './_src/Test';
import Addgroup from './_src/Addgroup';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Home">
        <Stack.Screen name="Dangnhap" component={Dangnhap} />
        <Stack.Screen name="Dangky" component={Dangky} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Auto" component={Auto} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({navigation, route}) => ({
            headerShown: true,
            title: route.params.name,
            headerLeft: () => {
              return (
                <View style={{flexDirection: 'row', marginLeft: -10}}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/ios-filled/50/null/back.png',
                      }}
                      style={{width: 40, height: 40, margin: 5}}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{
                      uri: route.params.photo,
                    }}
                    style={{width: 40, height: 40, margin: 5}}></Image>
                </View>
              );
            },
            
            // Add a placeholder button without the `onPress` to avoid flicker
          })}
        />
        <Stack.Screen name="Dktt" component={Dktt} />
        <Stack.Screen name="test" component={Test} />
        <Stack.Screen name="Addgroup" component={Addgroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
