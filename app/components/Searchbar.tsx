import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { IconButton } from 'react-native-paper';

interface SearchbarProps {
  onSearch: (query: string) => void;
}

export default function Searchbar({ onSearch }: SearchbarProps) {
  const [query, setQuery] = useState('');

  // Use debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <IconButton icon='magnify' size={24} iconColor='#495E57' />
        <TextInput
          style={styles.input}
          placeholder='Search dishes...'
          value={query}
          onChangeText={setQuery}
          placeholderTextColor='#495E57'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginTop: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#495E57',
    paddingVertical: 0,
  },
});
