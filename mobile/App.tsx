import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { I18nProvider } from './src/lib/i18n';
import { ThemeProvider } from './src/lib/theme';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { UploadScreen } from './src/screens/UploadScreen';

const queryClient = new QueryClient();

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Upload" component={UploadScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = React.useState(false);
  const [isAuthed, setIsAuthed] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('token')
      .then((t) => setIsAuthed(!!t))
      .finally(() => setReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          {!ready ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : (
            <NavigationContainer
              onStateChange={async () => {
                const t = await AsyncStorage.getItem('token');
                setIsAuthed(!!t);
              }}
            >
              <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthed ? (
                  <RootStack.Screen name="App" component={AppTabs} />
                ) : (
                  <RootStack.Screen name="Auth" component={AuthNavigator} />
                )}
              </RootStack.Navigator>
            </NavigationContainer>
          )}
          <StatusBar style="auto" />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
