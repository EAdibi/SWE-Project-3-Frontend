import React, { useCallback, useEffect, useState } from "react";
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
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, BookOpen, Brain, Plus, Search } from "lucide-react-native";

const windowWidth = Dimensions.get("window").width;
const STATUSBAR_HEIGHT = RNStatusBar.currentHeight || 0;

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchTopCategories();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setLessons(recentStudySets);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://quizwhiz-backend-679124120937.us-central1.run.app/lessons/keywords/${searchQuery}`
      );
      console.log(response.data);
      const sortedLessons = [...response.data].sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      );
      setLessons(sortedLessons);
    } catch (error) {
      setError(error.message || "Failed to Search");
    }
  };

  const fetchTopCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://quizwhiz-backend-679124120937.us-central1.run.app/lessons/top-categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError(error.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const recentStudySets = [
    {
      id: 1,
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript",
      category: "Programming",
      created_at: "2024-12-01T10:00:00.000000Z",
      updated_at: "2024-12-06T14:00:00.000000Z",
      is_public: true,
      created_by: 101,
    },
    {
      id: 2,
      title: "React Fundamentals",
      description: "Master the basics of React",
      category: "Frontend Development",
      created_at: "2024-12-02T11:30:00.000000Z",
      updated_at: "2024-12-05T15:00:00.000000Z",
      is_public: false,
      created_by: 102,
    },
    {
      id: 3,
      title: "Python Data Structures",
      description: "Deep dive into Python's data structures",
      category: "Programming",
      created_at: "2024-12-03T09:45:00.000000Z",
      updated_at: "2024-12-05T16:20:00.000000Z",
      is_public: true,
      created_by: 103,
    },
  ];
  const renderStudySet = (set) => (
    <TouchableOpacity
      key={`study-set-${set.id}`}
      style={styles.studySetCard}
      activeOpacity={0.7}
    >
      <Text style={styles.studySetTitle}>{set.title}</Text>
      <Text style={styles.cardCount}>{set.description}</Text>
      <View style={styles.studySetFooter}>
        <Text style={styles.lastStudied}>
          Updated {new Date(set.updated_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity style={styles.studyButton} activeOpacity={0.7}>
          <Text style={styles.studyButtonText}>Study</Text>
          <ArrowRight size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category) => (
    <TouchableOpacity
      key={`category-${category.category}`}
      style={styles.categoryCard}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryTitle}>{category.category}</Text>
      <Text style={styles.categoryCount}>{category.count} sets</Text>
    </TouchableOpacity>
  );

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
              {lessons.length === 0
                ? 
                  recentStudySets.map(renderStudySet)
                : 
                  lessons.slice(0, 5).map(renderStudySet)}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={24} color="white" />
              <Text style={styles.sectionTitle}>Popular Categories</Text>
            </View>

            {isLoading && (
              <Text style={styles.loadingText}>Loading categories...</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!isLoading && !error && (
              <View style={styles.categoriesGrid}>
                {categories.map(renderCategory)}
              </View>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: "100vh",
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT : 0,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    elevation: 4,
    padding: 12,
    height: 70,
    alignItems: "center",
    marginTop: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    padding: 12,
  },
  searchInputWrapper: {
    marginBottom: 8,
    position: "relative",
  },
  searchInput: {
    width: "100%",
    height: 44,
    paddingHorizontal: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontSize: 14,
    color: "white",
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
    color: "white",
  },
  studySetsGrid: {
    gap: 12,
  },
  studySetCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    marginHorizontal: 2,
  },
  studySetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    alignItems: "center",
    width: (windowWidth - 50) / 2,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "white",
  },
});

export default HomeScreen;
