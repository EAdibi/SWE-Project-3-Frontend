import { Tabs } from 'expo-router';
  import { useState, useEffect } from 'react';
  import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
  import { usePathname } from 'expo-router';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Home, Book, BookOpenText, MoreVertical, Settings, LogOut } from 'lucide-react';
  import { useRouter } from 'expo-router';

  export default function Layout() {
    const [username, setUsername] = useState('Sumit');
    const [menuVisible, setMenuVisible] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const excludedRoutes = ['/', '/signUp'];
    const showHeader = !excludedRoutes.includes(pathname);

    useEffect(() => {
      const getUsername = async () => {
        try {
          const storedUsername = await AsyncStorage.getItem('userData');
          if (storedUsername) {
            setUsername(storedUsername);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };
      getUsername();
    }, []);

    const handleLogout = async () => {
      try {
        await AsyncStorage.clear();
        router.replace('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    const CustomMenu = () => (
      <Modal
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        animationType="fade"
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/settings');
              }}
            >
              <Settings size={24} color="#71717a" />
              <Text style={styles.menuText}>Settings</Text>
            </Pressable>
            
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
            >
              <LogOut size={24} color="#71717a" />
              <Text style={styles.menuText}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    );

    const CustomHeader = () => {
      return (
        <View style={styles.header}>
          <Text style={styles.username}>{username}</Text>

          <View style={styles.navButtons}>
            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/homepage')}
            >
              <Home size={24} color={pathname === '/homepage' ? '#6b21a8' : '#71717a'} />
            </Pressable>

            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/flashcards')}
            >
              <Book size={24} color={pathname === '/flashcards' ? '#6b21a8' : '#71717a'} />
            </Pressable>

            <Pressable
              style={styles.navButton}
              onPress={() => router.push('/lessons')}
            >
              <BookOpenText size={24} color={pathname === '/lessons' ? '#6b21a8' : '#71717a'} />
            </Pressable>
          </View>

          <Pressable
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <MoreVertical size={24} color="#71717a" />
          </Pressable>

          <CustomMenu />
        </View>
      );
    };

    return (
      <Tabs
        screenOptions={{
          header: showHeader ? () => <CustomHeader /> : () => null,
          tabBarStyle: { display: 'none'},
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="homepage"
          options={{
            headerShown: showHeader,
          }}
        />
        <Tabs.Screen
          name="flashcards"
          options={{
            headerShown: showHeader,
          }}
        />
        <Tabs.Screen
          name="lessons"
          options={{
            headerShown: showHeader,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: showHeader,
          }}
        />
      </Tabs>
    );
  }

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'orange',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    navButtons: {
      flexDirection: 'row',
      gap: 24,
    },
    navButton: {
      padding: 8,
    },
    menuButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    menuContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 8,
      marginTop: 60,
      marginRight: 16,
      minWidth: 200,
      boxShadow: '#000',
      boxShadow: {
        width: 0,
        height: 2,
      },
      boxShadow: 0.25,
      boxShadow: 3.84,
      elevation: 5,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 12,
      borderRadius: 6,
    },
    menuText: {
      fontSize: 16,
      color: '#1f2937',
    },
  });