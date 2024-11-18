import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

// Mock flashcard data
const mockFlashcards = [
  {
    id: 1,
    question: "What is React Native?",
    answer: "React Native is a framework for building native mobile applications using React.",
    difficulty: "Beginner",
    category: "Mobile Development"
  },
  {
    id: 2,
    question: "What is JSX?",
    answer: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your React components.",
    difficulty: "Beginner",
    category: "React Basics"
  },
  {
    id: 3,
    question: "What are React Hooks?",
    answer: "Hooks are functions that allow you to use state and other React features in functional components.",
    difficulty: "Intermediate",
    category: "React Concepts"
  },
  {
    id: 4,
    question: "Explain Virtual DOM",
    answer: "Virtual DOM is a lightweight copy of the actual DOM that React uses to improve performance by minimizing direct manipulation of the DOM.",
    difficulty: "Intermediate",
    category: "React Concepts"
  },
  {
    id: 5,
    question: "What is State Management?",
    answer: "State management is the process of managing application state and data flow in React applications using tools like Redux, Context API, or other state management libraries.",
    difficulty: "Advanced",
    category: "React Advanced"
  }
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PublicFlashCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const navigateCards = (direction) => {
    if (direction === 'next' && currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = mockFlashcards[currentIndex];

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Flashcards</Text>
      
      <View style={styles.container}>
        <View style={styles.headerInfo}>
          <Text style={styles.counter}>
            Card {currentIndex + 1} of {mockFlashcards.length}
          </Text>
          <Text style={styles.difficulty}>
            Difficulty: <Text style={styles.difficultyText}>{currentCard.difficulty}</Text>
          </Text>
          <Text style={styles.category}>
            Category: <Text style={styles.categoryText}>{currentCard.category}</Text>
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateCards('prev')}
            disabled={currentIndex === 0}
          >
            <ChevronLeft 
              size={24} 
              color={currentIndex === 0 ? '#ccc' : '#000'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cardWrapper} 
            onPress={flipCard}
          >
            <View style={[styles.card, styles.cardFront]}>
              <Text style={styles.cardTitle}>
                {isFlipped ? "Answer:" : "Question:"}
              </Text>
              <Text style={styles.cardText}>
                {isFlipped ? currentCard.answer : currentCard.question}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateCards('next')}
            disabled={currentIndex === mockFlashcards.length - 1}
          >
            <ChevronRight 
              size={24} 
              color={currentIndex === mockFlashcards.length - 1 ? '#ccc' : '#000'} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>Tap card to flip</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex + 1) / mockFlashcards.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%',
    minHeight: screenHeight - 60, // Adjust this value based on your navbar height
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counter: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  difficulty: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  difficultyText: {
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  navigationButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardWrapper: {
    width: screenWidth * 0.6,
    height: 200,
    marginHorizontal: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    lineHeight: 24,
  },
  instruction: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
});

export default PublicFlashCards;