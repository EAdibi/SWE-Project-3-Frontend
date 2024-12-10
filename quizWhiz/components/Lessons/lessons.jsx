import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashCardDetails from "../FlashcardDetails/FlashcardDetails";
import CreateLessonModal from "../CreateLessonModal/createLessonModal";

const { width } = Dimensions.get("window");

const PublicLessons = () => {
  const router = useRouter();
  const [publicLessons, setPublicLessons] = useState([]);
  const [personalLessons, setPersonalLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  // const [lessonOwner, setLessonOwner] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCache, setUserCache] = useState({});

  const baseURL = "https://quizwhiz-backend-679124120937.us-central1.run.app";

  useFocusEffect(
    useCallback(() => {
      setSelectedLessonId(null);
      fetchPublicLessons();
      fetchPersonalLessons();
    }, [])
  );

  const handleCloseFlashCardsDetails = useCallback(() => {
    setSelectedLessonId(null);
    router.replace("/lessons");
  }, [router]);

  const fetchUserData = async (userId) => {
    if (userCache[userId]) return userCache[userId];

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        return { username: "Unknown User" };
      }

      const response = await axios.get(`${baseURL}/users/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        username: response.data.username,
        email: response.data.email,
        id: response.data.id,
        bio: response.data.bio,
      };

      setUserCache((prev) => ({ ...prev, [userId]: userData }));
      return userData;
    } catch (err) {
      console.error("Error fetching user data:", err);
      let defaultUsername = "Unknown User";

      if (err.response) {
        switch (err.response.status) {
          case 401:
            await AsyncStorage.removeItem("accessToken");
            defaultUsername = "Session Expired";
            break;
          case 403:
            defaultUsername = "Anonymous User";
            break;
          case 404:
            defaultUsername = "Deleted User";
            break;
        }
      }

      const fallbackUserData = {
        username: defaultUsername,
        id: userId,
      };

      setUserCache((prev) => ({ ...prev, [userId]: fallbackUserData }));
      return fallbackUserData;
    }
  };

  const fetchPublicLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userDataString, token] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("accessToken"),
      ]);

      if (!token) {
        throw new Error("No access token available");
      }

      const userData = JSON.parse(userDataString);

      const response = await axios.get(`${baseURL}/lessons/public`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: function (status) {
          return status < 500;
        },
      });

      if (response.status !== 200) {
        throw new Error(
          response.data?.message || "Failed to fetch public lessons"
        );
      }

      const lessonsWithUsers = await Promise.all(
        response.data.map(async (lesson) => {
          const lessonUserData = await fetchUserData(lesson.created_by);
          return {
            ...lesson,
            creatorName: lessonUserData.username || "Unknown User",
            isCurrentUser:
              userData &&
              lesson.created_by.toString() === userData.id.toString(),
          };
        })
      );

      setPublicLessons(lessonsWithUsers);
    } catch (err) {
      console.error("Error fetching public lessons:", err);
      setError(err.response?.data?.message || "Failed to fetch public lessons");
      setPublicLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalLessons = async () => {
    try {
      const [userDataString, token] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("accessToken"),
      ]);

      if (!token || !userDataString) {
        setPersonalLessons([]);
        return;
      }

      const userData = JSON.parse(userDataString);

      if (!userData || !userData.id) {
        setPersonalLessons([]);
        return;
      }

      const response = await axios.get(
        `${baseURL}/lessons/user/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      if (response.status === 404) {
        setPersonalLessons([]);
        return;
      }

      if (response.status !== 200) {
        throw new Error(
          response.data?.message || "Failed to fetch personal lessons"
        );
      }

      const privateLeasons = response.data.filter(
        (lesson) => !lesson.is_public
      );

      const lessonsWithUsers = await Promise.all(
        privateLeasons.map(async (lesson) => {
          const lessonUserData = await fetchUserData(lesson.created_by);
          return {
            ...lesson,
            creatorName: lessonUserData.username || "Unknown User",
            isCurrentUser:
              lesson.created_by.toString() === userData.id.toString(),
          };
        })
      );

      setPersonalLessons(lessonsWithUsers);
    } catch (err) {
      console.error("Error fetching personal lessons:", err);
      if (err.response?.status !== 404) {
        setError("Failed to fetch personal lessons");
      }
      setPersonalLessons([]);
    }
  };

  const handleLessonPress = async (lessonId) => {
    if (!lessonId) return;
    setSelectedLessonId(lessonId);
    router.push(`/lessons/#${lessonId}`);
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (selectedLessonId) {
    return (
      <FlashCardDetails
        lessonId={selectedLessonId}
        onBack={handleCloseFlashCardsDetails}
        previousRoute={"lessons"}
      />
    );
  }

  const renderLessonCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleLessonPress(item.id)}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <View style={styles.cardContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.authorContainer}>
              <Ionicons name="person-outline" size={16} color="#fff" />
              <Text style={styles.authorText}>
                {item.isCurrentUser ? "You" : item.creatorName}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {getFormattedDate(item.created_at)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderLessonsSection = (title, lessons) => {
    if (loading) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.sectionLoader}
          />
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {lessons.length > 0 ? (
          <View style={styles.cardsGrid}>
            {lessons.map((item) => renderLessonCard(item))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name={
                title === "Personal Lessons"
                  ? "document-outline"
                  : "globe-outline"
              }
              size={48}
              color="#fff"
            />
            <Text style={styles.noLessonsText}>
              {title === "Personal Lessons"
                ? "You haven't created any lessons yet"
                : "No public lessons available"}
            </Text>
            {title === "Personal Lessons" && (
              <TouchableOpacity
                style={styles.createEmptyButton}
                onPress={() => setCreateModalVisible(true)}
              >
                <Text style={styles.createEmptyButtonText}>
                  Create Your First Lesson
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer, styles.fullHeight]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centerContainer, styles.fullHeight]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              Promise.all([fetchPublicLessons(), fetchPersonalLessons()]);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {renderLessonsSection("Public Lessons", publicLessons)}
        {renderLessonsSection("Personal Lessons", personalLessons)}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mainContainer, styles.fullHeight]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lessons</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create Lesson</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </LinearGradient>

      <CreateLessonModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onLessonCreated={async (newLesson) => {
          const userData = await fetchUserData(newLesson.created_by);
          const lessonWithUser = {
            ...newLesson,
            creatorName: userData.username || "You",
            isCurrentUser: true,
          };

          if (newLesson.isPublic) {
            setPublicLessons((prevLessons) => [lessonWithUser, ...prevLessons]);
          } else {
            setPersonalLessons((prevLessons) => [
              lessonWithUser,
              ...prevLessons,
            ]);
          }

          await Promise.all([fetchPublicLessons(), fetchPersonalLessons()]);
          setCreateModalVisible(false);
        }}
        Action={"Create"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    minHeight: "100%",
  },
  fullHeight: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 40,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    borderRadius: 15,
    overflow: "hidden",
  },
  cardContent: {
    padding: 15,
    minHeight: 180,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: "auto",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  authorText: {
    marginLeft: 5,
    color: "#fff",
    fontSize: 12,
  },
  dateText: {
    color: "#fff",
    fontSize: 11,
    opacity: 0.8,
  },
  centerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  noLessonsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  flashcardsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  flashcardsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  flashcard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  flashcardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  sectionLoader: {
    marginTop: 20,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginTop: 10,
  },
  createEmptyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  createEmptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noLessonsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.9,
  },
});

export default PublicLessons;
