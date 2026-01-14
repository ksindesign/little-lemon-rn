import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, Image, StyleSheet, View } from 'react-native';

interface ImagePickerProps {
  image: string | null;
  onImageChange: (uri: string | null) => void;
}

export default function ImagePickerComponent({
  image,
  onImageChange,
}: ImagePickerProps) {
  const profileImage = require('../../assets/images/Profile.png');

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Permission to access the media library is required.'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onImageChange(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={image ? { uri: image } : profileImage}
          resizeMode='cover'
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title='Change' onPress={pickImage} color='#495E57' />
        {image && (
          <Button title='Remove' onPress={removeImage} color='#EF4B4C' />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
