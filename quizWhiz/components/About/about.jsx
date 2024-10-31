import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AboutComponent() {
  return (
    <View style={styles.componentContainer}>
      <Text style={styles.title}>About QuizWhiz</Text>
      <Text style={styles.description}>
        QuizWhiz is your ultimate quiz companion, designed to make learning fun and interactive.
      </Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Back to Home</Text>
      </Link>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 20,
    },
    link: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#007AFF',
      borderRadius: 5,
    },
    button: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#007AFF',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });