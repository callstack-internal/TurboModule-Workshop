import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StackNavigator from './StackNavigator.tsx';
import HowItWorksScreen from '../../screens/HowItWorksScreen.tsx';
import { Screens } from '../constants.ts';
import { DrawerParamList } from '../types.ts';

const Drawer = createDrawerNavigator<DrawerParamList>();

// Custom drawer content component
const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Text style={styles.drawerTitle}>Adopción de Perros</Text>
      <Text style={styles.drawerSubtitle}>Encuentra tu compañero ideal</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

function DogIcon({ color, size }: { color: string; size: number }) {
  return <Icon name="dog" size={size} color={color} style={styles.icon} />;
}

function HelpIcon({ color, size }: { color: string; size: number }) {
  return <Icon name="help-circle" size={size} color={color} style={styles.icon} />;
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#28a745',
        drawerInactiveTintColor: '#212529',
        drawerLabelStyle: {
          marginLeft: -16,
          fontSize: 16,
        },
      }}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name={Screens.Main.name}
        component={StackNavigator}
        options={{
          title: Screens.Main.title,
          drawerIcon: DogIcon,
        }}
      />
      <Drawer.Screen
        name={Screens.HowItWorks.name}
        component={HowItWorksScreen}
        options={{
          title: Screens.HowItWorks.title,
          drawerIcon: HelpIcon,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  icon: {
    marginRight: 10,
  },
});

export default DrawerNavigator;
