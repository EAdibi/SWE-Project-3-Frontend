import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from "expo-router";
import AlertDialog from '../Alert/alert';

const BACKEND_URL = "https://quizwhiz-backend-679124120937.us-central1.run.app";

const CreateLessonModal = ({ visible, onClose, onLessonCreated }) => {
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    category: '',
    is_public: false
  });

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title, message) => {
    setAlertConfig({
      visible: true,
      title,
      message,
    });
  };

  const handleCreateLesson = async () => {
    try {
      // Validate required fields
      if (!lessonForm.title || !lessonForm.description || !lessonForm.category) {
        showAlert('Error', 'Please fill in all required fields');
        return;
      }

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.post(
        `${BACKEND_URL}/lessons/new`,
        lessonForm,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      // Clear form
      setLessonForm({
        title: '',
        description: '',
        category: '',
        is_public: false
      });
      
      // Notify parent component about the new lesson
      if (onLessonCreated) {
        onLessonCreated(response.data);
      }
      
      onClose();
      showAlert('Success', 'Lesson created successfully!');
    } catch (err) {
      showAlert(
        'Error',
        err.response?.data?.error || 'Failed to create lesson'
      );
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Lesson</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={lessonForm.title}
              onChangeText={(text) =>
                setLessonForm((prev) => ({ ...prev, title: text }))
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={lessonForm.description}
              onChangeText={(text) =>
                setLessonForm((prev) => ({ ...prev, description: text }))
              }
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={lessonForm.category}
              onChangeText={(text) =>
                setLessonForm((prev) => ({ ...prev, category: text }))
              }
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Make Public</Text>
              <Switch
                value={lessonForm.is_public}
                onValueChange={(value) =>
                  setLessonForm((prev) => ({ ...prev, is_public: value }))
                }
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={lessonForm.is_public ? '#4158D0' : '#f4f3f4'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateLesson}
              >
                <LinearGradient
                  colors={['#4158D0', '#C850C0']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Create</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertDialog
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    padding: 12,
  },
  createButton: {
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateLessonModal;