import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <Stack initialRouteName='index'>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='OnboardingScreen'
              options={{ title: 'Onboarding', headerShown: false }}
            />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
