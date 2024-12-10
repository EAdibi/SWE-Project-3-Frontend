import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AddFlashcardModal = ({ isVisible, onClose, onSubmit, lessonId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserID(userData.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }

    if (!userID) {
      alert("User data not available. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        "https://quizwhiz-backend-679124120937.us-central1.run.app/flashcards/",
        {
          front_text: question,
          back_text: answer,
          lesson: lessonId,
          created_by: userID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onSubmit(response.data);
      setQuestion("");
      setAnswer("");
      onClose();
    } catch (error) {
      console.log(lessonId);
      console.log(question);
      console.log(answer);
      console.log(userID);
      console.error("Error creating flashcard:", error);
      if (error.response) { 
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      onClose();
      alert("Failed to create flashcard. Please try again.");

    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Flashcard</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter question"
            value={question}
            onChangeText={setQuestion}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Enter answer"
            value={answer}
            onChangeText={setAnswer}
            multiline
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddFlashcardModal;
