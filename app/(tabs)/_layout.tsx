import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home',
          tabBarActiveTintColor: '#495E57',
        }}
      />
      <Tabs.Screen
        name='ProfileScreen'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Profile',
          headerLeft: () => (
            <IconButton
              icon='arrow-left'
              size={24}
              iconColor='#495E57'
              onPress={() => router.back()}
            />
          ),
          tabBarActiveTintColor: '#495E57',
        }}
      />
    </Tabs>
  );
}
