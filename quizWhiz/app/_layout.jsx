import { Tabs } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Home,
  Book,
  BookOpenText,
  MoreVertical,
  Settings,
  LogOut,
  ShieldCheck,
  Library
} from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router";

export default function Layout() {
  const [username, setUsername] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [id, setID] = useState();
  const pathname = usePathname();
  const router = useRouter();
  const excludedRoutes = ["/", "/signUp"];
  const showHeader = !excludedRoutes.includes(pathname);

  const getUsername = useCallback(async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setID(userData.id);
        setUsername(userData.username);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setUsername("");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (showHeader) {
        getUsername();
      }
    }, [showHeader, getUsername])
  );

  useEffect(() => {
    const handleStorageChange = () => {
      getUsername();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getUsername]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUsername("");
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
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
          {id === 11 && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/admin");
              }}
            >
              <ShieldCheck size={24} stroke="#71717a" />
              <Text style={styles.menuText}>Admin</Text>
            </Pressable>
          )}
          {id === 11 && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/manageAllLessons");
              }}
            >
              <ShieldCheck size={24} stroke="#71717a" />
              <Text style={styles.menuText}>Manage All Lessons</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push("/manageYourLessons");
            }}
          >
            <Library size={24} stroke="#71717a" />
            <Text style={styles.menuText}>Manage Lessons</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push("/settings");
            }}
          >
            <Settings size={24} stroke="#71717a" />
            <Text style={styles.menuText}>Settings</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
          >
            <LogOut size={24} stroke="#71717a" />
            <Text style={styles.menuText}>Logout</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  const CustomHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.username}>
            {username ? `Welcome, ${username}` : "Welcome"}
          </Text>
        </View>
  
        <View style={styles.centerSection}>
          <View style={styles.navButtons}>
            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/homepage")}
            >
              <Home
                size={24}
                stroke={pathname === "/homepage" ? "#6b21a8" : "#71717a"}
              />
            </Pressable>
  
            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/flashcards")}
            >
              <Book
                size={24}
                stroke={pathname === "/flashcards" ? "#6b21a8" : "#71717a"}
              />
            </Pressable>
  
            <Pressable
              style={styles.navButton}
              onPress={() => router.push("/lessons")}
            >
              <BookOpenText
                size={24}
                stroke={pathname === "/lessons" ? "#6b21a8" : "#71717a"}
              />
            </Pressable>
          </View>
        </View>
  
        <View style={styles.rightSection}>
          <Pressable
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <MoreVertical size={24} stroke="white" />
          </Pressable>
        </View>
  
        <CustomMenu />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        header: showHeader ? () => <CustomHeader /> : () => null,
        tabBarStyle: { display: "none" },
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  navButtons: {
    flexDirection: "row",
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginTop: 60,
    marginRight: 16,
    minWidth: 200,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderRadius: 6,
  },
  menuText: {
    fontSize: 16,
    color: "#1f2937",
  },
});