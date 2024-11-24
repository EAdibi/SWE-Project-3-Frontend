import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import axios from "axios";

const mockFlashcards = [
  {
    id: 1,
    question: "What is React Native?",
    answer:
      "React Native is a framework for building native mobile applications using React.",
    difficulty: "Beginner",
    category: "Mobile Development",
  },
  {
    id: 2,
    question: "What is JSX?",
    answer:
      "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your React components.",
    difficulty: "Beginner",
    category: "React Basics",
  },
  {
    id: 3,
    question: "What are React Hooks?",
    answer:
      "Hooks are functions that allow you to use state and other React features in functional components.",
    difficulty: "Intermediate",
    category: "React Concepts",
  },
  {
    id: 4,
    question: "Explain Virtual DOM",
    answer:
      "Virtual DOM is a lightweight copy of the actual DOM that React uses to improve performance by minimizing direct manipulation of the DOM.",
    difficulty: "Intermediate",
    category: "React Concepts",
  },
  {
    id: 5,
    question: "What is State Management?",
    answer:
      "State management is the process of managing application state and data flow in React applications using tools like Redux, Context API, or other state management libraries.",
    difficulty: "Advanced",
    category: "React Advanced",
  },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PublicFlashCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashCards, setFlashCards] = useState(mockFlashcards);
  const [isFlipped, setIsFlipped] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const navigateCards = (direction) => {
    if (direction === "next" && currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // const fetchFlashCards = async () => {
  //   try {
  //     const response = await axios.get("/getAllPublicFlashCards");
  //     const data = response.data;
  //     setFlashCards(Array.from(data));
  //   } catch (error) {
  //     console.error("Error fetching flashcards:", error);
  //   }
  // };

  // const fetchFlashCards = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const response = await axios.get("/getAllPublicFlashCards", {
  //       timeout: 5000, 
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });

  //     if (response.status !== 200) {
  //       throw new Error(`Server responded with status: ${response.status}`);
  //     }

  //     const data = response.data;
      
  //     if (!Array.isArray(data)) {
  //       throw new Error('Received invalid data format from server');
  //     }

  //     const validatedData = data.map((card, index) => {
  //       if (!card.question || !card.answer) {
  //         console.warn(`Flashcard at index ${index} is missing required fields`);
  //         return null;
  //       }
  //       return {
  //         id: card.id || index + 1,
  //         question: card.question,
  //         answer: card.answer,
  //         difficulty: card.difficulty || 'Not specified',
  //         category: card.category || 'Uncategorized'
  //       };
  //     }).filter(card => card !== null);

  //     setFlashCards(validatedData);
  //     setCurrentIndex(0); 
  //     setIsLoading(false);
  //     setRetryCount(0);

  //   } catch (error) {
  //     console.error("Error fetching flashcards:", error);
  //     setError(error.message || 'Failed to fetch flashcards');
  //     setIsLoading(false);

  //     if (retryCount < 3) {
  //       const backoffTime = Math.pow(2, retryCount) * 1000;
  //       setTimeout(() => {
  //         setRetryCount(prev => prev + 1);
  //         fetchFlashCards();
  //       }, backoffTime);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchFlashCards();
  // }, []);


  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const SWIPE_THRESHOLD = 50;
    if (event.translationX > SWIPE_THRESHOLD) {
      navigateCards("prev");
    } else if (event.translationX < -SWIPE_THRESHOLD) {
      navigateCards("next");
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        navigateCards("prev");
      } else if (event.key === "ArrowRight") {
        navigateCards("next");
      } else if(event.key === " "){
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, isFlipped]);

  const currentCard = flashCards[currentIndex];

  // if (isLoading && flashCards === mockFlashcards) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.loadingText}>Loading flashcards...</Text>
  //     </View>
  //   );
  // }

  if (error && flashCards === mockFlashcards) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setRetryCount(0);
            fetchFlashCards();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainContainer}
      >
        <Text style={styles.heading}>Flashcards</Text>

        <View style={styles.container}>
          <View style={styles.headerInfo}>
            <Text style={styles.counter}>
              Card {currentIndex + 1} of {flashCards.length}
            </Text>
            <Text style={styles.difficulty}>
              Difficulty:{" "}
              <Text style={styles.difficultyText}>
                {currentCard.difficulty}
              </Text>
            </Text>
            <Text style={styles.category}>
              Category:{" "}
              <Text style={styles.categoryText}>{currentCard.category}</Text>
            </Text>
          </View>

          <GestureDetector gesture={swipeGesture}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => navigateCards("prev")}
                disabled={currentIndex === 0}
              >
                <ChevronLeft
                  size={24}
                  color={currentIndex === 0 ? "#ccc" : "#000"}
                />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.cardWrapper]} onPress={flipCard}>
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
                onPress={() => navigateCards("next")}
                disabled={currentIndex === flashCards.length - 1}
              >
                <ChevronRight
                  size={24}
                  color={
                    currentIndex === flashCards.length - 1 ? "#ccc" : "#000"
                  }
                />
              </TouchableOpacity>
            </View>
          </GestureDetector>

          <Text style={styles.instruction}>
            Tap card to flip • Swipe or use arrow keys to navigate
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / flashCards.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    minHeight: screenHeight - 60,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  counter: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  difficulty: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  difficultyText: {
    fontWeight: "bold",
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  categoryText: {
    fontWeight: "bold",
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  navigationButton: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardWrapper: {
    width: screenWidth * 0.6,
    height: 200,
    marginHorizontal: 20,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    lineHeight: 26,
  },
  instruction: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginTop: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PublicFlashCards;
