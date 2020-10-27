import * as React from 'react';
import { 
    KeyboardAvoidingView, View, Button, Alert, Text, AsyncStorage, StyleSheet, TextInput, Image, ImageBackground, TouchableOpacity
} from 'react-native';
import Config from '../constants/Config';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage, hideMessage } from "react-native-flash-message";

export default class Otp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          mobileno: AsyncStorage.getItem('mobileno'), 
          otp: '',
          spinner: false
        };

        // const { signIn } = React.useContext(AuthContext);

        /* set from async storagr */
        AsyncStorage.getItem("mobileno").then((result) => {
            this.setState({mobileno: result});
        });

        this._signInHandler = this._signInHandler.bind(this);
    }

    _signInHandler = async () => {
        const {mobileno,otp} = this.state;

        if(otp.length == 0)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'OTP No. is required!',
                type: "warning",
            });
        }
        else if(otp.length > 0 && otp.length < 6)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'OTP should be 6 digits!',
                type: "warning",
            });
        }
        else if(otp.length > 6)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'OTP should be 6 digits!',
                type: "warning",
            });
        }
        else
        {
            const data = { mobileno: mobileno, otp: otp, key: Config.REQ_KEY };

            this.setState({spinner: true});

            const response = await fetch(Config.API_URL+'tokenapi/validate_otp', {
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

            if (response.success) 
            {
                var userToken = response.token;
                AsyncStorage.setItem('userToken', userToken);
                AsyncStorage.setItem('fullName', response.user_data.name_surname);
                AsyncStorage.setItem('userId', response.user_data.id);
                AsyncStorage.setItem('userName', response.user_data.username);
                AsyncStorage.setItem('loggedin', response.user_data.loggedin);
                AsyncStorage.setItem('type', response.user_data.type);
                AsyncStorage.setItem('user_data', response.user_data);
                showMessage({
                    message: 'Success',
                    description: response.message,
                    type: "success",
                });
                
                // this.props.navigation.navigate('Home');
                this.props.navigation.push('Home');
            }
            else
            {    
                showMessage({
                    message: 'Error Occured!',
                    description: response.message,
                    type: "danger", // "success", "info", "warning", "danger"
                });
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
                        onChangeText={otp => this.setState({otp})}
                        style={style.input}
                        placeholder="Enter OTP"
                        value={this.state.otp}
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
});