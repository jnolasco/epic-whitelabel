import React from 'react';
import {Icon, ScrollableTab, Text} from 'native-base';
import DefaultProps from '../constants/navigation';
import AppConfig from '../constants/config';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  TeaserRootContainer,
  TestFlightContainer,
  DashboardRootContainer,
} from '../containers';

const RootStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();

const Main = () => (
  <MainTab.Navigator tabBarOptions={{ showLabel: false }}>
    <MainTab.Screen
      name="Dashboard"
      component={Dashboard}
      showLabel="false"
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon type="MaterialCommunityIcons" name="home" {...DefaultProps.icons} />)
      }}
    />
  </MainTab.Navigator>
)

const Dashboard = () => (
  <DashboardStack.Navigator headerMode="none">
    <DashboardStack.Screen name="DashboardRoot" component={DashboardRootContainer} />
  </DashboardStack.Navigator>
)

const Router = () => (
  <NavigationContainer>
    <RootStack.Navigator headerMode="screen">
      <RootStack.Screen options={{headerShown: false}} name="TestFlight" component={TestFlightContainer}/>
      <RootStack.Screen options={{headerShown: false}} name="Teaser" component={TeaserRootContainer}/>
      <RootStack.Screen options={{headerShown: true}} name="Main" component={Main} />
    </RootStack.Navigator>
  </NavigationContainer>
);


export default Router;
