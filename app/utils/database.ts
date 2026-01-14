import * as SQLite from 'expo-sqlite';

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string | null;
};

export type MenuItem = {
  id?: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

// Open/create the database
const db = SQLite.openDatabaseSync('little_lemon.db');

// Initialize the database and create the users table if it doesn't exist
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        profilePic TEXT
      );
    `);

    // Add column if it doesn't exist (for existing users)
    try {
      await db.execAsync('ALTER TABLE users ADD COLUMN profilePic TEXT;');
    } catch (e) {
      // Column might already exist
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Initialize menu database table
export const initMenuDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
    console.log('Menu database initialized successfully');
  } catch (error) {
    console.error('Error initializing menu database:', error);
    throw error;
  }
};

// Save user data (insert or update)
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    // First, check if a user already exists
    const existingUser = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM users LIMIT 1'
    );

    if (existingUser) {
      // Update existing user
      await db.runAsync(
        'UPDATE users SET firstName = ?, lastName = ?, email = ?, profilePic = ? WHERE id = ?',
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.profilePic || null,
          existingUser.id,
        ]
      );
      console.log('User data updated successfully');
    } else {
      // Insert new user
      await db.runAsync(
        'INSERT INTO users (firstName, lastName, email, profilePic) VALUES (?, ?, ?, ?)',
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.profilePic || null,
        ]
      );
      console.log('User data saved successfully');
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const user = await db.getFirstAsync<UserData>(
      'SELECT firstName, lastName, email, profilePic FROM users LIMIT 1'
    );
    return user || null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Clear all user data (useful for logout)
export const clearUserData = async (): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM users');
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

// Save menu items to database
export const saveMenuItems = async (menuItems: MenuItem[]): Promise<void> => {
  try {
    // Clear existing menu items first
    await db.runAsync('DELETE FROM menu');

    // Insert all menu items
    for (const item of menuItems) {
      await db.runAsync(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.price, item.description, item.image, item.category]
      );
    }
    console.log(`Saved ${menuItems.length} menu items to database`);
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
};

// Get all menu items from database
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const items = await db.getAllAsync<MenuItem>('SELECT * FROM menu');
    return items || [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
};

// Check if menu items exist in database
export const hasMenuItems = async (): Promise<boolean> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM menu'
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('Error checking menu items:', error);
    return false;
  }
};

// Filter menu items by categories and search query
export const filterMenuItems = async (
  categories: string[],
  searchQuery: string = ''
): Promise<MenuItem[]> => {
  try {
    let query = 'SELECT * FROM menu';
    const params: any[] = [];
    const conditions: string[] = [];

    // Filter by categories if any selected
    if (categories.length > 0) {
      const placeholders = categories.map(() => 'LOWER(?)').join(', ');
      conditions.push(`LOWER(category) IN (${placeholders})`);
      params.push(...categories);
    }

    // Filter by search query if present
    if (searchQuery.trim() !== '') {
      conditions.push('name LIKE ?');
      params.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const items = await db.getAllAsync<MenuItem>(query, params);
    console.log(
      `Filtered ${items.length} items for categories: [${categories.join(
        ', '
      )}] and query: "${searchQuery}"`
    );
    return items || [];
  } catch (error) {
    console.error('Error filtering menu items:', error);
    throw error;
  }
};
