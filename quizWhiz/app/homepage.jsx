import { View, ScrollView, StyleSheet } from 'react-native';
import HomeScreen from '../components/Homepage/homepage';

export default function Page() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HomeScreen />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh', 
    backgroundColor: 'transparent', 
  },
  contentContainer: {
    flexGrow: 1,  
    minHeight: '100%',
  },
});