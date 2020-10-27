//App.js
import React, {Component} from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from "react-native-flash-message";

import Home from './screens/Home.js';
import SignIn from './screens/Signin.js';
import Otp from './screens/Otp.js';

const Stack = createStackNavigator();

export default function App(props) {
  

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  // let userToken ='';
  
  const AuthContext = React.createContext();
  
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SignIn':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      //userToken: null+"---",
    }
  );
    
    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
      async function loadResourcesAndDataAsync() {
        try {
          SplashScreen.preventAutoHide();

          // Load our initial navigation state
          setInitialNavigationState(await getInitialState());
          // setInitialNavigationState();

          // Load fonts
          await Font.loadAsync({
            ...Ionicons.font,
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          });
        } catch (e) {
          // We might want to provide this error information to an error reporting service
          console.warn(e);
        } finally {
          setLoadingComplete(true);
          SplashScreen.hide();
        }
      }
      
       // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
          //Restoring token failed
        }

        // After restoring token, we may need to validate it in production apps

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      };

      loadResourcesAndDataAsync();
      bootstrapAsync();
      
    }, []);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
      return null;
    } else 
    {
      if(state.userToken!==undefined)
      {
        var check_state = false;
        (state.userToken) ? (check_state = 'true'):(check_state = 'false')
        if(check_state==true){
          (state.userToken != 'undefined') ? (check_state = 'true'):(check_state = 'false')
        }
      }
      // console.log(check_state);

    return (
      <NavigationContainer>
          {
            <Stack.Navigator initialRouteName={(check_state) ?"SignIn": "Home"} screenOptions={{gestureEnabled: false}}>
            <Stack.Screen name="Home" component={Home} options={{title: 'Search for Vehicle',headerLeft: null, gestureEnabled: false,headerStyle: { backgroundColor: '#233861' }, headerTitleStyle: {color: 'white'} }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{title: 'Signin with Mobile Number',headerLeft: null, gestureEnabled: false, headerStyle: { backgroundColor: '#233861' }, headerTitleStyle: {color: 'white'} }} />
            <Stack.Screen name="Otp" component={Otp} options={{title: 'Enter OTP for Login', headerStyle: { backgroundColor: '#233861' }, headerTitleStyle: {color: 'white'}}} />
            </Stack.Navigator>
          }
      <FlashMessage position="top" />
      </NavigationContainer>
    );
    
  }
  
}