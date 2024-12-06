import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import axios from "axios";

const MAX_RETRIES = 3;

const Card = memo(({ isFlipped, currentCard, onFlip, styles }) => (
  <TouchableOpacity style={[styles.cardWrapper]} onPress={onFlip}>
    <View style={[styles.card, styles.cardFront]}>
      <Text style={styles.cardTitle}>{isFlipped ? "Answer" : "Question"}</Text>
      <Text style={styles.cardText}>
        {isFlipped ? currentCard.back_text : currentCard.front_text}
      </Text>
    </View>
  </TouchableOpacity>
));

class FlashCardsErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FlashCards Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Something went wrong. Please try reloading the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const PublicFlashCards = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashCards, setFlashCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const navigateCards = useCallback(
    (direction) => {
      if (direction === "next" && currentIndex < flashCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else if (direction === "prev" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
      }
    },
    [currentIndex, flashCards.length]
  );

  const fetchFlashCards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        "https://quizwhiz-backend-679124120937.us-central1.run.app/flashcards/public/"
      );
      console.log(response.data);
      setFlashCards(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setError(error.message || "Failed to fetch flashcards");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashCards();
  }, []);

  const flipCard = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

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
      } else if (event.key === " ") {
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCards, flipCard]);

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
      color: "#666",
      textAlign: "center",
    },
    errorText: {
      fontSize: 16,
      color: "#ff0000",
      textAlign: "center",
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    retryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      textAlign: "center",
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
      fontWeight: "bold",
    },
    lessonInfo: {
      fontSize: 14,
      marginBottom: 4,
      color: "#666",
    },
    lessonText: {
      fontWeight: "bold",
      color: "#333",
    },
    dateInfo: {
      fontSize: 14,
      color: "#666",
      fontStyle: "italic",
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        {retryCount < MAX_RETRIES && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setRetryCount((prev) => prev + 1);
              fetchFlashCards();
            }}
          >
            <Text style={styles.retryButtonText}>
              Retry ({MAX_RETRIES - retryCount} attempts remaining)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (flashCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No flashcards available</Text>
      </View>
    );
  }

  const currentCard = flashCards[currentIndex] || null;

  if (!currentCard) {
    return (
      <View style={styles.container}> 
        <Text style={styles.errorText}>Error: Could not load card</Text>
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
            <Text style={styles.lessonInfo}>
              Lesson:{" "}
              <Text style={styles.lessonText}>{currentCard.lesson}</Text>
            </Text>
            <Text style={styles.dateInfo}>
              Created: {new Date(currentCard.created_at).toLocaleDateString()}
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

              <Card
                isFlipped={isFlipped}
                currentCard={currentCard}
                onFlip={flipCard}
                styles={styles}
              />

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

export default function FlashCardsWithErrorBoundary() {
  return (
    <FlashCardsErrorBoundary>
      <PublicFlashCards />
    </FlashCardsErrorBoundary>
  );
}
