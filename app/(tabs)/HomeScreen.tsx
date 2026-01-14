import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MenuFilter from '../components/MenuFilter';
import Searchbar from '../components/Searchbar';
import menuCategoryData from '../data/menuCategory.json';
import {
  filterMenuItems,
  getMenuItems,
  getUserData,
  hasMenuItems,
  initMenuDatabase,
  MenuItem,
  saveMenuItems,
} from '../utils/database';

const categories = Array.from(
  new Set(menuCategoryData.menu.map((item) => item.category))
).map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

const MENU_API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const getMenuImageSource = (imageFileName: string) => {
  if (imageFileName === 'grilledFish.jpg') {
    return require('../../assets/images/grilledFish.png');
  }
  return {
    uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`,
  };
};

export default function HomeScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const defaultProfilePic = require('../../assets/images/Profile.png');

  // Load initial menu data
  useEffect(() => {
    loadMenuData();
  }, []);

  // Fetch updated profile picture whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const userData = await getUserData();
          if (userData && userData.profilePic) {
            setProfilePic(userData.profilePic);
          } else {
            setProfilePic(null);
          }
        } catch (error) {
          console.error('Error fetching user data for header:', error);
        }
      };

      fetchUserData();
    }, [])
  );

  const handleFilter = useCallback(async () => {
    try {
      const filteredItems = await filterMenuItems(
        selectedCategories,
        searchQuery
      );
      setMenuItems(filteredItems);
    } catch (error) {
      console.error('Error filtering menu items:', error);
      Alert.alert('Error', 'Failed to filter menu items.');
    }
  }, [selectedCategories, searchQuery]);

  // Filter menu items whenever selected categories or search query change
  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);

      // Initialize menu database
      await initMenuDatabase();

      // Check if menu items already exist in database
      const hasData = await hasMenuItems();

      if (hasData) {
        // Load from database
        console.log('Loading menu from database...');
        const items = await getMenuItems();
        setMenuItems(items);
        console.log(`Loaded ${items.length} items from database`);
      } else {
        // Fetch from API and save to database
        console.log('Fetching menu from API...');
        const response = await fetch(MENU_API_URL);
        const data = await response.json();

        if (data.menu && Array.isArray(data.menu)) {
          // Save to database
          await saveMenuItems(data.menu);
          setMenuItems(data.menu);
          console.log(`Fetched and saved ${data.menu.length} items from API`);
        }
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
      Alert.alert('Error', 'Failed to load menu items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#495E57' />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Image
          source={getMenuImageSource(item.image)}
          style={styles.menuItemImage}
          resizeMode='cover'
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Little Lemon</Text>
            <Text style={styles.headerSubtitle}>Chicago</Text>
          </View>
          <Link href='/(tabs)/ProfileScreen' asChild>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={profilePic ? { uri: profilePic } : defaultProfilePic}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.headerHero}>
          <View style={styles.heroContent}>
            <Text style={styles.headerDescription}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            source={require('../../assets/images/Hero image.png')}
            style={styles.heroImage}
          />
        </View>
        <Searchbar onSearch={handleSearch} />
      </View>

      <View style={styles.filterSection}>
        <MenuFilter
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#495E57',
  },
  header: {
    backgroundColor: '#495E57',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  heroContent: {
    flex: 1,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 5,
  },
  headerDescription: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 16,
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  listContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
    paddingVertical: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    paddingRight: 16,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#495E57',
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
