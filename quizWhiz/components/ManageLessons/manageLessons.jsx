import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateLessonModal from "../CreateLessonModal/createLessonModal";

const BACKEND_URL = "https://quizwhiz-backend-679124120937.us-central1.run.app";

const LessonActionModal = ({
  visible,
  onClose,
  selectedLesson,
  onUpdate,
  onDelete,
}) => (
  <Modal
    transparent
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{selectedLesson?.title}</Text>
        <Text style={styles.modalDescription}>
          {selectedLesson?.description}
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.updateModalButton]}
            onPress={() => {
              onClose();
              onUpdate();
            }}
          >
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.deleteModalButton]}
            onPress={() => {
              onClose();
              onDelete();
            }}
          >
            <LinearGradient
              colors={["#ff4b4b", "#ff0000", "#cc0000"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Modal>
);

const ManageYourLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchLessons();
    }, [])
  );

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userDataString, token] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("accessToken"),
      ]);

      if (!token || !userDataString) {
        setLessons([]);
        return;
      }

      const userData = JSON.parse(userDataString);

      if (!userData || !userData.id) {
        setLessons([]);
        return;
      }

      const response = await axios.get(
        `${BACKEND_URL}/lessons/user/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      if (response.status === 404) {
        setLessons([]);
        return;
      }

      if (response.status !== 200) {
        throw new Error(
          response.data?.message || "Failed to fetch personal lessons"
        );
      }

      setLessons(response.data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Failed to load lessons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonAction = (lesson) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  const handleDeleteLesson = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      await axios.delete(`${BACKEND_URL}/lessons/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          lesson_id: selectedLesson.id,
        },
      });

      setLessons(lessons.filter((lesson) => lesson.id !== selectedLesson.id));
      setModalVisible(false);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to delete lesson"
      );
    }
  };

  const handleOpenUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.lessonCard}
      onPress={() => handleLessonAction(item)}
    >
      <View style={styles.lessonContent}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text
          style={styles.descriptionText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>
      <Text style={styles.moreText}>•••</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Manage Your Lessons</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4158D0" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLessons}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : lessons.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="document-outline" size={48} color="#fff" />
            <Text style={styles.noLessonsText}>
              You haven't created any lessons yet
            </Text>
            <TouchableOpacity
              style={styles.createEmptyButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.createEmptyButtonText}>
                Create Your First Lesson
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={lessons}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={true}
            style={styles.flatList}
          />
        )}

        <LessonActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedLesson={selectedLesson}
          onUpdate={handleOpenUpdateModal}
          onDelete={handleDeleteLesson}
        />

        <CreateLessonModal
          visible={updateModalVisible}
          onClose={() => setUpdateModalVisible(false)}
          onLessonCreated={(updatedLesson) => {
            setLessons(
              lessons.map((lesson) =>
                lesson.id === selectedLesson.id ? updatedLesson : lesson
              )
            );
            setUpdateModalVisible(false);
            setModalVisible(false);
          }}
          Action="Update"
          initialValues={selectedLesson}
        />

        <CreateLessonModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onLessonCreated={(newLesson) => {
            setLessons([...lessons, newLesson]);
            setCreateModalVisible(false);
          }}
          Action="Create"
          initialValues={null}
        />
        
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  lessonCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonContent: {
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  moreText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4158D0",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
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

export default ManageYourLessons;