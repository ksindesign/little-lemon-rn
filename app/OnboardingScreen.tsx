import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { initDatabase, saveUserData } from './utils/database';

export default function OnboardingScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDataFilled = firstName.trim() && lastName.trim() && email.trim();

  // Initialize database when component mounts
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error('Failed to initialize database:', error);
      Alert.alert('Error', 'Failed to initialize database');
    });
  }, []);

  const handleSubmit = async () => {
    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await saveUserData({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });

      Alert.alert('Success', 'Your profile has been saved!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/HomeScreen'),
        },
      ]);
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Little Lemon!</Text>
      <Text style={styles.subtitle}>Please complete your profile</Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder='First Name'
          label='First Name'
          autoCapitalize='words'
          onChangeText={setFirstName}
          value={firstName}
          style={styles.input}
          mode='outlined'
        />
        <TextInput
          placeholder='Last Name'
          label='Last Name'
          autoCapitalize='words'
          onChangeText={setLastName}
          value={lastName}
          style={styles.input}
          mode='outlined'
        />
        <TextInput
          placeholder='Email'
          label='Email'
          autoCapitalize='none'
          keyboardType='email-address'
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          mode='outlined'
        />
      </View>

      {isDataFilled && (
        <Button
          mode='contained'
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}
        >
          Next
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#495E57',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    paddingVertical: 8,
    backgroundColor: '#F4CE14',
  },
});
