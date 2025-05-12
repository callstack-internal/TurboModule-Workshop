import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../../screens/HomeScreen.tsx';
import AdoptedDogsScreen from '../../screens/AdoptedDogsScreen.tsx';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Screens } from '../constants.ts';

export type TabParamList = {
  Adoptar: undefined;
  MisPerros: undefined;
};

// Define the drawer navigation prop type for React Navigation 7
type DrawerNavProp = {
  openDrawer: () => void;
};

const Tab = createBottomTabNavigator<TabParamList>();

function AdoptarIcon({ color, size }: { color: string; size: number }) {
  return <Icon name="dog" color={color} size={size} />;
}

function MisPerrosIcon({ color, size }: { color: string; size: number }) {
  return <Icon name="heart" color={color} size={size} />;
}

function HeaderLeft({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.headerLeft} onPress={onPress}>
      <Icon name="menu" size={24} color="#212529" />
    </TouchableOpacity>
  );
}

function TabNavigator() {
  const navigation = useNavigation<DrawerNavProp>();

  const headerLeft = useCallback(
    () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
    [navigation],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#6c757d',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#212529',
        },
        headerLeft,
      }}
    >
      <Tab.Screen
        name={Screens.Adoptar.name}
        component={HomeScreen}
        options={{
          tabBarIcon: AdoptarIcon,
          title: Screens.Adoptar.title,
        }}
      />
      <Tab.Screen
        name={Screens.MisPerros.name}
        component={AdoptedDogsScreen}
        options={{
          tabBarIcon: MisPerrosIcon,
          title: Screens.MisPerros.title,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 16,
  },
});

export default TabNavigator;
