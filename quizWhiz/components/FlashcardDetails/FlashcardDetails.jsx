import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import axios from "axios";

const MAX_RETRIES = 3;

const Card = memo(({ isFlipped, currentCard, onFlip, styles }) => (
  <TouchableOpacity style={[styles.cardWrapper]} onPress={onFlip}>
    <View style={[styles.card]}>
      <Text style={styles.cardTitle}>{isFlipped ? "Answer" : "Question"}</Text>
      <Text style={styles.cardText}>
        {isFlipped ? currentCard.back_text : currentCard.front_text}
      </Text>
    </View>
  </TouchableOpacity>
));

const FlashCardDetail = ({ lessonId, onBack, previousRoute }) => {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashCards, setFlashCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: "100%",
      minHeight: screenHeight - 60,
    },
    header: {
      width: "100%",
      flexDirection: "column",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      padding: 8,
      borderRadius: 8,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    backButtonText: {
      color: "#fff",
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "500",
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
      shadowOffset: { width: 0, height: 4 },
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
    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 36,
      color: "white",
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
  });

  const handleGoBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
    if(previousRoute == "lessons"){
      router.push("/lessons");
    }
  }, [onBack, router]);

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
        `https://quizwhiz-backend-679124120937.us-central1.run.app/flashcards/by-lesson/${lessonId}`
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
    if (lessonId) {
      fetchFlashCards();
    }
  }, [lessonId]);

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

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#4158D0", "#C850C0", "#FFCC70"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.messageText}>Loading flashcards...</Text>
          </View>
        </LinearGradient>
      </GestureHandlerRootView>
    );
  }

  if (error || !flashCards.length) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#4158D0", "#C850C0", "#FFCC70"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || "No flashcards available for this lesson"}
            </Text>
            {error && retryCount < MAX_RETRIES && (
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
        </LinearGradient>
      </GestureHandlerRootView>
    );
  }

  const currentCard = flashCards[currentIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={styles.headerInfo}>
            <Text style={styles.counter}>
              Card {currentIndex + 1} of {flashCards.length}
            </Text>
            <Text style={styles.dateInfo}>
              Updated: {new Date(currentCard.updated_at).toLocaleDateString()}
            </Text>
          </View>

          <GestureDetector gesture={swipeGesture}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={[
                  styles.navigationButton,
                  currentIndex === 0 && { opacity: 0.5 },
                ]}
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
                style={[
                  styles.navigationButton,
                  currentIndex === flashCards.length - 1 && { opacity: 0.5 },
                ]}
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
            Tap card to flip • Swipe to navigate
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

export default FlashCardDetail;
