import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  Dimensions,
  Modal,
  StatusBar as RNStatusBar
} from 'react-native';
import { 
  ArrowRight, 
  BookOpen, 
  Brain, 
  Plus, 
  Search 
} from 'lucide-react-native';

const windowWidth = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = RNStatusBar.currentHeight || 0;

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false); //State to control dropdown visibility

  const recentStudySets = [
    { id: 1, title: 'JavaScript Basics', cards: 25, lastStudied: '2 days ago' },
    { id: 2, title: 'React Fundamentals', cards: 30, lastStudied: '1 week ago' },
    { id: 3, title: 'Python Data Structures', cards: 40, lastStudied: '3 days ago' }
  ];

  const categories = [
    { id: 1, name: 'Mathematics', count: 1200 },
    { id: 2, name: 'Science', count: 950 },
    { id: 3, name: 'Languages', count: 1500 },
    { id: 4, name: 'Programming', count: 800 }
  ];

  // Toggle Dropdown modal visiblity
  const toggleDropdown = () => {
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>
      <RNStatusBar 
        backgroundColor="#F9FAFB"
        barStyle="dark-content"
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>QuizWhiz</Text>

            {/* CREATE SET BUTTON */}
            <TouchableOpacity style={styles.createButton}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Set</Text>
            </TouchableOpacity>

            {/* PROFILE PICTURE */}
            <TouchableOpacity style={styles.profilePicture} onPress={toggleDropdown}>
              <Text style={styles.profileInitials}>PH</Text> {/* Placeholder Initials, Add functionality */}
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for study sets..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.searchIconContainer}>
              <Search size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* STUDY SETS SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#2563EB" />
            <Text style={styles.sectionTitle}>Recent Study Sets</Text>
          </View>
          
          {/* LIST OF RECENT STUDY SETS */}
          <View style={styles.studySetsGrid}>
            {recentStudySets.map(set => (
              <TouchableOpacity 
                key={set.id} 
                style={styles.studySetCard}
                activeOpacity={0.7}
              >
                <Text style={styles.studySetTitle}>{set.title}</Text>
                <Text style={styles.cardCount}>{set.cards} cards</Text>
                <View style={styles.studySetFooter}>
                  <Text style={styles.lastStudied}>
                    Last studied {set.lastStudied}
                  </Text>
                  <TouchableOpacity 
                    style={styles.studyButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.studyButtonText}>Study</Text>
                    <ArrowRight size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* POPULAR CATEGORIES SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#2563EB" />
            <Text style={styles.sectionTitle}>Popular Categories</Text>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {category.count} sets
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* DROPDOWN MODAL */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => { /* NAVIGATE TO SETTINGS*/}}>
              <Text style={styles.dropdownItem}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* HANDLE LOGOUT */}}>
              <Text style={styles.dropdownItem}>Log out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  profileInitials: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 20,
  },
  dropdownMenu: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    padding: 12,
    height: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  createButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  searchContainer: {
    padding: 12,
  },
  searchInputWrapper: {
    marginBottom: 8,
  },
  searchInput: {
    width: '100%',
    height: 44,
    paddingHorizontal: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 12,
    top: '25%',
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  studySetsGrid: {
    gap: 12,
  },
  studySetCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    marginHorizontal: 2,
  },
  studySetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardCount: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  studySetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastStudied: {
    fontSize: 12,
    color: '#6B7280',
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  studyButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    elevation: 2,
    alignItems: 'center',
    width: (windowWidth - 40) / 2,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#4B5563',
  },
});

export default HomeScreen;