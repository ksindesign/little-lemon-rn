import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  function handleBackButton() {
    router.back();
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTitleStyle: { color: '#495E57' },
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarActiveTintColor: '#495E57',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen
        name='HomeScreen'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='ProfileScreen'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' size={size} color={color} />
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              name='arrow-left'
              size={24}
              color='#495E57'
              onPress={handleBackButton}
              style={{ marginLeft: 16 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
