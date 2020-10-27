import React, { Component } from 'react'
import { Alert, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';

export default class Inputs extends Component {

   constructor(props) {
      super(props);

      this.state = {
         mobileno: ''
      };
      // var navigation = useNavigation();
   }


   handleMobileno = (text) => {
      this.setState({ mobileno: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (mobileno) => {
      //  console.log(mobileno.length);
      if(mobileno.length == 0)
      {
         Alert.alert('Mobile No. is required!');
         console.log('Mobile No. is required!');
      }
      else if(mobileno.length > 0 && mobileno.length < 10)
      {
         Alert.alert('Mobile No. should be digits.'); 
         console.log('Mobile No. should be digits.');
      }
      else if(mobileno.length > 10)
      {
         Alert.alert('Mobile No. should be digits.'); 
         console.log('Mobile No. should be digits.');
      }
      else
      {
         const data = { mobileno: mobileno, key: '4PcY4Dku0JkuretevfEPMnG9BGBPi' };

         fetch('http://customercaresupport-co.in/kyard/tokenapi/validate_mobile', {
            
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data),
         })
         .then((response) => response.json())
         .then((res) => {
            console.log(res);
            if(res.success)
            {
               // navigation.navigate('Home');
               Alert.alert(res.message);
            }
            else
            {
               Alert.alert(res.message);
            }
         })
         .catch((err) => {
            console.error(err);
            Alert.alert(err);
         });
      }
   }
   render() {
      return (
         <View style = {styles.container}>
            <TextInput style = {styles.input}
                keyboardType="numeric"
                underlineColorAndroid = "transparent"
                placeholder = "Enter Mobile No."
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText = {this.handleMobileno} 
            />
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.mobileno)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
// export default Inputs

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   input: {
      margin: 15,
      padding: 10,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   submitButton: {
      backgroundColor: '#7a42f4',
      alignItems: 'center',
      padding: 10,
      margin: 15,
      height: 40,
   },
   submitButtonText:{
      color: 'white'
   }
})