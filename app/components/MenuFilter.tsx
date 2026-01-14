import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface MenuFilterProps {
  categories: string[];
  onFilterChange?: (selectedCategories: string[]) => void;
}

export default function MenuFilter({
  categories,
  onFilterChange,
}: MenuFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelection);
    onFilterChange?.(newSelection);
  };

  const isSelected = (category: string) =>
    selectedCategories.includes(category);

  return (
    <View>
      <Text style={styles.filterText}>ORDER FOR DELIVERY!</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {categories.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => toggleCategory(tab)}
            style={[
              styles.filterTab,
              isSelected(tab) && styles.filterTabSelected,
            ]}
          >
            <Text
              variant='bodySmall'
              style={[
                styles.filterTabText,
                isSelected(tab) && styles.filterTabTextSelected,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  filterTab: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  filterTabSelected: {
    backgroundColor: '#495E57',
  },
  filterTabText: {
    color: '#495E57',
    fontWeight: '600',
  },
  filterTabTextSelected: {
    color: '#FFFFFF',
  },
});
