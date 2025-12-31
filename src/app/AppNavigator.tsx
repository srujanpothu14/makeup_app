
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuthStore } from '../store/useAuthStore';

export default function AppNavigator() {
  const { user, hydrate } = useAuthStore();
  useEffect(() => { hydrate(); }, [hydrate]);
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
