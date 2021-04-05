import React, {Fragment} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {fromRight} from 'react-navigation-transitions';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from './src/assets/css/Colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

/* Screens */
import Splash from './src/views/Splash';
import Login from './src/views/Login';
import Home from './src/views/Home';
import Logout from './src/views/Logout';
import Profile from './src/views/Profile';
import Forgot from './src/views/Forgot';
import Otp from './src/views/Otp';
import Reset from './src/views/Reset';
import MyOrders from './src/views/MyOrders';
import Notification from './src/views/Notification';
import OrderDetails from './src/views/OrderDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#00003f',
        labelStyle: {fontFamily: 'TitilliumWeb-Regular'},
        style: {
          backgroundColor: colors.theme_bg,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          tabBarLabel: 'MyOrders',
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-shirt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({color, size}) => (
            <Icon name="ios-more" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Splash">
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Home" component={MyTabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Reset" component={Reset} />
        <Stack.Screen name="Splash" component={Splash} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
