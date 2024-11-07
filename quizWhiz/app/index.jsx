import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import HomeScreen from '../components/Homepage/homepage';
import Login from '../components/Login/login';

export default function Home() {
  return (
    <View>
      <Login/>
    </View>
  );
}
