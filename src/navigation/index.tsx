import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
const RootStack = createNativeStackNavigator({
  screens: {
    Login: LoginScreen,
    Home: HomeScreen,
    Signup: SignupScreen,
  },
});

export const Navigation = createStaticNavigation(RootStack);
