import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

//TODO How do I link to all users Lessons that they have created.
// Assuming you have a function to fetch flashcards based on lesson ID
const fetchFlashcardsForLesson = (lessonId) => {
  // ... logic to fetch flashcards from API or local storage ...
  return [
    { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces' },
    // ... more flashcards for the lesson ...
  ];
};

const mockData = [
  { id: 1, title: 'React Basics', description: 'Learn the fundamentals of React', createdBy: 'John Doe', isPublic: true },
  { id: 2, title: 'Redux Essentials', description: 'Master state management with Redux', createdBy: 'Jane Smith', isPublic: false },
  { id: 3, title: 'Java Basics', description: 'Learn the fundamentals of Java', createdBy: 'John Doe', isPublic: true },
  { id: 4, title: 'Advanced Python', description: 'Master advanced Python concepts', createdBy: 'Jane Smith', isPublic: true },
  { id: 5, title: 'Web Development 101', description: 'Introduction to HTML, CSS, and JavaScript', createdBy: 'Alice Johnson', isPublic: false },
  { id: 6, title: 'Data Science Essentials', description: 'Learn the basics of data analysis and visualization', createdBy: 'Mike Brown', isPublic: true },
  { id: 7, title: 'Machine Learning Basics', description: 'Get started with machine learning algorithms', createdBy: 'Sophia Davis', isPublic: false },
  { id: 8, title: 'C# for Beginners', description: 'Introduction to C# programming', createdBy: 'Chris Wilson', isPublic: true },
  { id: 9, title: 'React Crash Course', description: 'Learn React fundamentals in a short time', createdBy: 'Evan Taylor', isPublic: true },
  { id: 10, title: 'Cybersecurity Fundamentals', description: 'Basics of staying secure online', createdBy: 'Natalie Moore', isPublic: false },
  { id: 11, title: 'DevOps Practices', description: 'Understanding DevOps tools and methodologies', createdBy: 'Oliver Clark', isPublic: true },
  { id: 12, title: 'SQL Mastery', description: 'Become proficient in SQL queries and databases', createdBy: 'Emma Martinez', isPublic: false }
  // ... more mock data ...
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lessonItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  lessonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lessonCard: {
    // ... card styles, e.g., background color, shadow, padding ...
    backgroundColor: 'gray',
    // boxShadow: 10px 5px 5px red,
    //! I don't know how to style with react native lol
  },
});

const PublicLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    // Fetch public lessons from API or use mock data
    setLessons(mockData.filter(lesson => lesson.isPublic));
  }, []);

  const handleLessonPress = (lessonId) => {
    setSelectedLessonId(lessonId);
    const fetchedFlashcards = fetchFlashcardsForLesson(lessonId);
    setFlashcards(fetchedFlashcards);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.lessonCard} onPress={() => handleLessonPress(item.id)}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Created by: {item.createdBy}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.lessonTitle}>Public Lessons</Text>
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {selectedLessonId && (
        <View>
          <Text>Flashcards for Lesson {selectedLessonId}</Text>
          {/* Render flashcards using a similar FlatList or other suitable component */}
          <FlatList
            data={flashcards}
            renderItem={({ item }) => (
              <View>
                <Text>{item.front}</Text>
                <Text>{item.back}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default PublicLessons;