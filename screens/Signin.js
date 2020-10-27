import * as React from 'react';
import { 
    KeyboardAvoidingView, View, Button, Alert, Text, AsyncStorage, StyleSheet, TextInput, Image, ImageBackground, TouchableOpacity
} from 'react-native';
import Config from '../constants/Config';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage, hideMessage } from "react-native-flash-message";
//import Otp from 'Otp';

export default class Signin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileno: '', 
            spinner: false
        };

        this._signInHandler = this._signInHandler.bind(this);
        
    }

    _signInHandler = async () => {
        //this.props.navigation.navigate('Otp');
        //return;
        const {mobileno} = this.state;

        if(mobileno.length == 0)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'Mobile No. is required!',
                type: "warning",
            });
        }
        else if(mobileno.length > 0 && mobileno.length < 10)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'Mobile No. should be 10 digits!',
                type: "warning",
            });
        }
        else if(mobileno.length > 10)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'Mobile No. should be 10 digits!',
                type: "warning",
            });
        }
        else
        {
            const data = { mobileno: mobileno, key: Config.REQ_KEY };

            this.setState({spinner: true});

            const response = await fetch(Config.API_URL+'tokenapi/validate_mobile', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(resp => {
                this.setState({spinner: false});
                return resp.json();
            })
            .catch(error => {
                this.setState({spinner: false});
                throw error;
            });

            if (response.success) {
                await AsyncStorage.setItem('mobileno', mobileno);
                showMessage({
                    message: 'Success',
                    description: response.message,
                    type: "success",
                });
                this.props.navigation.navigate('Otp');
            }
            else {
                // "success", "info", "warning", "danger" 
                showMessage({
                    message: 'Error Occured!',
                    description: response.message,
                    type: "danger",
                });
                // await Alert.alert('Error', response.message);
            }
        }
    }

    render() {
        return (
            <View style={{
                flex:1,
                height:'100%',
            }}>
            <ScrollView style={style.container} contentContainerStyle={style.contentContainer}>
                <View style={style.welcomeContainer}>
                    <Image
                        source={
                            __DEV__
                            ? require('../assets/images/robot-dev.png')
                            : require('../assets/images/robot-prod.png')
                        }
                        style={style.welcomeImage}
                    />
                </View>
                <View style={style.container}>
                    <TextInput 
                        keyboardType="numeric"
                        onChangeText={mobileno => this.setState({mobileno})}
                        style={style.input}
                        placeholder="Enter Mobile No."
                        value={this.state.mobileno}
                    />
                    {this.state.spinner &&
                        <Text style={style.spinnerTextStyle}>Processing ...</Text>
                    }
                    {!this.state.spinner &&
                        <TouchableOpacity
                            style = {style.submitButton}
                            onPress = {
                                () => this._signInHandler()
                            }>
                            <Text style = {style.submitButtonText}> Submit </Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
            <ImageBackground source={__DEV__ ? require('../assets/images/bg_rka.png') : require('../assets/images/bg_rka.png')} 
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 300,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}
                imageStyle={{
                    resizeMode: 'contain' // works only here!
                }}
                >
            </ImageBackground>
            </View>
        );
    }
}



const style = StyleSheet.create({
    container: {
        flex: 0.5, 
        backgroundColor: '#fff',
        height:'100%'
    },
    contentContainer: {
        paddingTop: 30,
    }, 
    input: {
        margin: 15,
        padding: 10,
        height: 40,
        borderColor: '#233861',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#233861',
        alignItems: 'center',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText:{
        color: 'white'
    },
    spinnerTextStyle: {
        textAlign: 'center'
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
      },
      welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 20,
        marginLeft: -10,
      },
      backgroundImage: {
        flex: 1,
        // resizeMode: 'cover', // or 'stretch'
        // remove width and height to override fixed static size
        width: null,
        height: null,
      }
});