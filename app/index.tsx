import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getUserData, initDatabase } from './utils/database';

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      // Initialize database
      await initDatabase();

      // Check if user data exists
      const userData = await getUserData();

      if (userData) {
        // User is onboarded, go to Home tab
        router.replace('/(tabs)');
      } else {
        // User is not onboarded, go to Onboarding
        router.replace('/OnboardingScreen');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, default to onboarding
      router.replace('/OnboardingScreen');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#495E57' />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
