import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: '#fff' } }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='profile/[id]' options={{ headerShown: false }} />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Thread',
          headerShadowVisible: false,
          headerTintColor: 'black',
          headerBackTitle: 'Back',
          headerRight: () => {
            return <Ionicons name='notifications-outline' size={24} />;
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
