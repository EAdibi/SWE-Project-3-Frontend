import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PublicLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCache, setUserCache] = useState({});

  const baseURL = 'https://quizwhiz-backend-679124120937.us-central1.run.app';

  useEffect(() => {
    fetchPublicLessons();
  }, []);

  const fetchUserData = async (userId) => {
    if (userCache[userId]) return userCache[userId];

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found');
        return { username: 'Unknown User' };
      }

      const response = await axios.get(`${baseURL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extract the relevant user data from the response
      const userData = {
        username: response.data.username,
        email: response.data.email,
        id: response.data.id,
        bio: response.data.bio
      };
      
      setUserCache(prev => ({ ...prev, [userId]: userData }));
      return userData;

    } catch (err) {
      console.error('Error fetching user data:', err);
      let defaultUsername = 'Unknown User';
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            await AsyncStorage.removeItem('accessToken');
            defaultUsername = 'Session Expired';
            break;
          case 403:
            defaultUsername = 'Anonymous User';
            break;
          case 404:
            defaultUsername = 'Deleted User';
            break;
        }
      }
      
      const fallbackUserData = {
        username: defaultUsername,
        id: userId
      };
      
      setUserCache(prev => ({ ...prev, [userId]: fallbackUserData }));
      return fallbackUserData;
    }
  };

  const fetchPublicLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user ID and access token
      const [currentUserId, token] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('accessToken')
      ]);

      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios.get(`${baseURL}/lessons/public`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const lessonsWithUsers = await Promise.all(
        response.data.map(async (lesson) => {
          const userData = await fetchUserData(lesson.created_by);
          return { 
            ...lesson, 
            creatorName: userData.username || 'Unknown User',
            isCurrentUser: lesson.created_by.toString() === currentUserId
          };
        })
      );
      
      setLessons(lessonsWithUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lessons');
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = async (lessonId) => {
    try {
      setSelectedLessonId(lessonId);
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios.get(`${baseURL}/lessons/${lessonId}/flashcards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFlashcards(response.data);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError('Failed to fetch flashcards');
    }
  };

  // Rest of the component remains the same
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
                {item.isCurrentUser ? 'You' : item.creatorName}
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
            onPress={fetchPublicLessons}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (lessons.length === 0) {
      return (
        <View style={[styles.centerContainer, styles.fullHeight]}>
          <Text style={styles.noLessonsText}>No public lessons available</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {lessons.map(item => renderLessonCard(item))}
        </View>
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
          <Text style={styles.headerTitle}>Public Lessons</Text>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create Lesson</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </LinearGradient>

      {selectedLessonId && flashcards.length > 0 && (
        <View style={styles.flashcardsContainer}>
          <Text style={styles.flashcardsTitle}>Flashcards for Lesson {selectedLessonId}</Text>
          <ScrollView>
            {flashcards.map(item => (
              <View key={item.id} style={styles.flashcard}>
                <Text style={styles.flashcardText}>{item.front}</Text>
                <Text style={styles.flashcardText}>{item.back}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
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
    minHeight: '100%',
  },
  fullHeight: {
    height: '100%',
    minHeight: 900,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
    minHeight: 180,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 12,
  },
  dateText: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noLessonsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  flashcardsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  flashcardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flashcard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  flashcardText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default PublicLessons;