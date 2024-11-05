import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import HomeScreen from '../components/Homepage/homepage';

export default function Home() {
  return (
    <View style={styles.container}>
      <HomeScreen/>
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