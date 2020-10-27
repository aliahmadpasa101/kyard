//AuthNavigation.js
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const AuthNavigation = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: { title: 'My app' },
    },
    Signup: {
      screen: Signup,
      navigationOptions: { title: 'My app' },
    },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
  }
);

export default AuthNavigation