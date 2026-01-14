import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import ImagePickerComponent from '../components/ImagePicker';
import { clearUserData, getUserData, saveUserData } from '../utils/database';

export default function ProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data from SQLite when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserData();

      if (userData) {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        setImage(userData.profilePic || null);
      } else {
        // No user data found, redirect to onboarding
        Alert.alert(
          'No Profile Found',
          'Please complete the onboarding process first.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/OnboardingScreen'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load your profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
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

    setIsSaving(true);

    try {
      await saveUserData({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        profilePic: image,
      });

      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to update your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear your profile data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserData();
              router.push('/OnboardingScreen');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#495E57' />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.btnContainer}>
        <Button mode='outlined' onPress={handleLogout} textColor='#EE9972'>
          Logout
        </Button>
        <Button
          mode='contained'
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          buttonColor='#495E57'
          textColor='#fff'
        >
          Save
        </Button>
      </View>

      <ImagePickerComponent image={image} onImageChange={setImage} />

      <View style={styles.formContainer}>
        <Text style={{ color: '#495E57' }}>First Name</Text>
        <TextInput
          placeholder='First Name'
          autoCapitalize='words'
          value={firstName}
          onChangeText={setFirstName}
          style={{ ...styles.input }}
          mode='outlined'
          textColor='#495E57'
        />
        <Text style={{ color: '#495E57' }}>Last Name</Text>
        <TextInput
          placeholder='Last Name'
          autoCapitalize='words'
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          mode='outlined'
          textColor='#495E57'
        />
        <Text style={{ color: '#495E57' }}>Email</Text>
        <TextInput
          placeholder='Email'
          autoCapitalize='none'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode='outlined'
          textColor='#495E57'
        />
        <Text style={{ color: '#495E57' }}>Phone Number</Text>
        <TextInput
          placeholder='Phone Number'
          autoCapitalize='none'
          keyboardType='phone-pad'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          mode='outlined'
          textColor='#495E57'
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageBtn: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    color: '#495E57',
    height: 40,
    fontSize: 16,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
