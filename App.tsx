import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import SessionScreen from './src/screens/SessionScreen';
import { checkLoginStatus } from './src/services/auth';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const session = await checkLoginStatus();
      setInitialRoute(session ? 'Session' : 'Login');
    };

    init();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{flex:1, justifyContent:'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
