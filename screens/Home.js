import React,{Component} from 'react';
import { 
    KeyboardAvoidingView, View, Button,ListView,FlatList, Alert, Text, AsyncStorage, StyleSheet, SafeAreaView, TextInput, Image, ImageBackground, TouchableOpacity, Dimensions
} from 'react-native';
import Config from '../constants/Config';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage, hideMessage } from "react-native-flash-message";
import { List, ListItem } from 'react-native-elements';
import {Ionicons} from "@expo/vector-icons";
import shortid from "shortid";
import {Autocomplete, withKeyboardAwareScrollView} from "react-native-dropdown-autocomplete";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileno: '',
            userToken: null,
            type: '',
            search: '',
            dataSource: {},
            spinner: false,  
            hideResults: false,  
        };

        AsyncStorage.getItem("userToken").then((result) => { // set from async storagr usertoken 
            if(result){
                this.setState({userToken: result});
            }
            else
            {
                AsyncStorage.clear();
                this.props.navigation.navigate('SignIn');
            }
        });

        AsyncStorage.getItem("mobileno").then((result) => { // set from async storagr mobile 
            this.setState({mobileno: result});
        });
        
        AsyncStorage.getItem("type").then((result) => { // set from async storagr type 
            this.setState({type: result});
        });

        this.handleSelectItem = this.handleSelectItem.bind(this);
    }

    handleSelectItem = async (item, index) => {
        const {onDropdownClose} = this.props;
        onDropdownClose();
        
        let search_id = item.id;
        const {mobileno,type,userToken} = this.state;

        if(search_id.length == 0)
        {
            showMessage({
                message: 'Error Occured!',
                description: 'Invalid Vehicle',
                type: "danger",
            });
        }
        else
        {
            const data = {  token: userToken, id: search_id, mobileno: mobileno, type: type};
            const res =  await fetch(Config.API_URL+'tokenapi/select_vehile', {
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
                return resp.json();
            })
            .catch(error => {
                throw error;
            });

            if (res.success) {
                this.setState({dataSource: res.results});
            }
            else 
            {   
                if (res.token) {
                    showMessage({
                        message: 'Error Occured!',
                        description: res.message,
                        type: "danger", // "success", "info", "warning", "danger" 
                    });
                }
                else{
                    AsyncStorage.clear();
                    this.props.navigation.navigate('SignIn');
                    showMessage({
                        message: 'Error Occured!',
                        description: res.message,
                        type: "danger", // "success", "info", "warning", "danger" 
                    });
                }
            }
        }

    }
  render() {
    
    const autocompletes = [...Array(1).keys()];
    const apiUrl = Config.API_URL+'tokenapi/search_vehicle/'+this.state.userToken;
    const {scrollToInput, onDropdownClose, onDropdownShow, hideResults, setHideResults} = this.props;

      return (
        <View>
        <View style={style.container} contentContainerStyle={style.contentContainer}>
            <View style={{
                flex:1,
                height:'100%',
            }}>
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
                <View style={styles.autocompletesContainer}>
                    <SafeAreaView style={{flex:1}}>
                    {autocompletes.map(() => (
                        <Autocomplete
                        key={shortid.generate()}
                        style={styles.input}
                        inputContainerStyle ={styles.inputContainer}
                        spinnerStyle ={styles.spinnerStyle}
                        placeholder={"Search by Vehicle Number                    "}
                        scrollToInput={ev => scrollToInput(ev)}
                        handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
                        onDropdownClose={() => onDropdownClose()}
                        onDropdownShow={() => onDropdownShow()}
                        renderIcon={() => (
                            <Ionicons name="ios-search" size={20} color="#c7c6c1" style={styles.plus} />
                        )}
                        fetchDataUrl={apiUrl}
                        minimumCharactersCount={2}
                        hideResults={this.state.hideResults}
                        onBlur={() => this.setState({ hideResults: false })}
                        onFocusOut={() => this.setState({ hideResults: false })}

                        highlightText
                        valueExtractor={item => item.name}
                        rightContent
                        rightTextExtractor={item => item.id}
                        />
                    ))}
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({ item }) => (
                            <View key={item.id} style={styles.viewContainer}>
                                <Text style={styles.tblText}> 
                                    <Text> {"Vehicle No.\t:"}</Text> {((item.vehicle_no==null)?"N/A":item.vehicle_no)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Party Name\t:"}</Text> {((item.party_name==null)?"N/A":item.party_name)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Make\t:"}</Text> {((item.make==null)?"N/A":item.make)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Model\t:"}</Text> {((item.model==null)?"N/A":item.model)} 
                                </Text>
                                <Text style={styles.tblText}>
                                    <Text> {"Chassis No.\t:"}</Text> {((item.chassis_no==null)?"N/A":item.chassis_no)} 
                                </Text>
                                <Text style={styles.tblText}>
                                    <Text> {"Engine No.\t:"}</Text> {((item.engine_no==null)?"N/A":item.engine_no)} 
                                </Text>
                                {/* <Text style={{ display: ((this.state.type == "MANAGER")?"block":"none") }}> */}
                                <Text style={styles.tblText}> 
                                    <Text> {"Agreement No.\t:"}</Text> {((item.agreement_no==null)?"N/A":item.agreement_no)} 
                                </Text>
                                {/* </Text> */}
                                <Text style={styles.tblText}>
                                    <Text> {"Branch\t:"}</Text> {((item.branch==null)?"N/A":item.branch)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Finance\t:"}</Text> {((item.finance==null)?"N/A":item.finance)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Confirmation No.\t:"}</Text> {((item.confirmation_no==null)?"N/A":item.confirmation_no)} 
                                </Text>
                                <Text style={styles.tblText}> 
                                    <Text> {"Confirmation Name\t:"}</Text> {((item.confirmation_no==null)?"N/A":item.confirmation_name)} 
                                </Text>
                                
                                <ImageBackground source={__DEV__ ? require('../assets/images/bg_rka.png') : require('../assets/images/bg_rka.png')} 
                                style={{
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: 100,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                }}
                                imageStyle={{
                                    resizeMode: 'contain' // works only here!
                                }}
                                ></ImageBackground>
                            </View>
                        )
                    }
                    keyExtractor={item => item.id}
                    />
                    </SafeAreaView>
                </View>
            </View>
        </View>
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
        paddingTop: 10,
    }, 
    spinnerTextStyle: {
        textAlign: 'center'
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 0,
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

var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    autocompletesContainer: {
        paddingTop: 0,
        marginLeft: 15,
        marginRight: 10,
        marginBottom: 10,
        zIndex: 1,
        width: width*.9,
        maxWidth:"100%",
        alignItems:"stretch",
        paddingHorizontal: 8,
    },
    input: {
        alignItems: 'stretch',
        paddingHorizontal: 0,
        maxHeight: 40
    },
    inputContainer: {
        display: "flex",
        flexShrink: 0,
        flexGrow: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#c7c6c1",
        paddingVertical: 13,
        paddingLeft: 12,
        paddingRight: "5%",
        // width: width*.9,
        width: "100%",
        justifyContent: "flex-start",
    },
    spinnerStyle: {
        position: "absolute",
        right: 35,
        top: 25,
    },
    plus: {
        position: "absolute",
        left: 25,
        top: 25,
    },
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    viewContainer: {
      flex: 1,
      marginTop:30,
      zIndex:9,
    },
    tblText: {
      borderBottomWidth: 1,
      paddingBottom: 5,
      marginBottom: 10,
      //color: "#ff6347",
      color: "#000000",
      fontSize:20,
      fontWeight:"bold",
      borderBottomColor: "#233861",
      zIndex:1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
  });

  export default withKeyboardAwareScrollView(Home);
