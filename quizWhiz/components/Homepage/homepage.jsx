import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StatusBar as RNStatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, BookOpen, Brain, Plus, Search } from "lucide-react-native";

const windowWidth = Dimensions.get("window").width;
const STATUSBAR_HEIGHT = RNStatusBar.currentHeight || 0;

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const recentStudySets = [
    { id: 1, title: "JavaScript Basics", cards: 25, lastStudied: "2 days ago" },
    { id: 2, title: "React Fundamentals", cards: 30, lastStudied: "1 week ago" },
    { id: 3, title: "Python Data Structures", cards: 40, lastStudied: "3 days ago" },
  ];

  const categories = [
    { id: 1, name: "Mathematics", count: 1200 },
    { id: 2, name: "Science", count: 950 },
    { id: 3, name: "Languages", count: 1500 },
    { id: 4, name: "Programming", count: 800 },
  ];

  return (
    <LinearGradient
      colors={["#4158D0", "#C850C0", "#FFCC70"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mainContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>QuizWhiz</Text>
            <TouchableOpacity style={styles.createButton}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Set</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for study sets..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="white"
              />
              <View style={styles.searchIconContainer}>
                <Search size={20} color="white" />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={24} color="white" />
              <Text style={styles.sectionTitle}>Recent Study Sets</Text>
            </View>

            <View style={styles.studySetsGrid}>
              {recentStudySets.map((set) => (
                <TouchableOpacity
                  key={set.id}
                  style={styles.studySetCard}
                  activeOpacity={0.7}
                >
                  <Text style={styles.studySetTitle}>{set.title}</Text>
                  <Text style={styles.cardCount}>{set.cards} cards</Text>
                  <View style={styles.studySetFooter}>
                    <Text style={styles.lastStudied}>
                      Last studied {set.lastStudied}
                    </Text>
                    <TouchableOpacity
                      style={styles.studyButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.studyButtonText}>Study</Text>
                      <ArrowRight size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={24} color="white" />
              <Text style={styles.sectionTitle}>Popular Categories</Text>
            </View>

            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {category.count} sets
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: '100vh',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT : 0,
  },
  content: {
    flex: 1,
    paddingBottom: 20, // Add padding at the bottom for better scrolling
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    elevation: 4,
    padding: 12,
    height: 60,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  createButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  searchContainer: {
    padding: 12,
  },
  searchInputWrapper: {
    marginBottom: 8,
    position: 'relative',
  },
  searchInput: {
    width: "100%",
    height: 44,
    paddingHorizontal: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    fontSize: 14,
    color: 'white',
  },
  searchIconContainer: {
    position: "absolute",
    left: 12,
    top: "25%",
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: 'white',
  },
  studySetsGrid: {
    gap: 12,
  },
  studySetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    marginHorizontal: 2,
  },
  studySetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: 'white',
    marginBottom: 6,
  },
  cardCount: {
    fontSize: 14,
    color: "white",
    marginBottom: 12,
  },
  studySetFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastStudied: {
    fontSize: 12,
    color: "white",
  },
  studyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  studyButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    alignItems: "center",
    width: (windowWidth - 40) / 2,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: 'white',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "white",
  },
});

export default HomeScreen;