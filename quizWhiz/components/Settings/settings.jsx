import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  TextInput,
  Switch
} from 'react-native';

// Mock user data
const mockUserData = {
  id: '12345',
  username: 'johndoe',
  email: 'john.doe@example.com',
  notifications: true,
  privacy: false
};

const Settings = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(mockUserData.username);
  const [editedEmail, setEditedEmail] = useState(mockUserData.email);

  const handleUpdateAccount = () => {
    // In a real app, this would call an API to update user data
    setUserData({
      ...userData,
      username: editedUsername,
      email: editedEmail
    });
    setIsEditing(false);
    Alert.alert('Success', 'Account updated successfully');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Account Deleted', 'Your account has been permanently removed.');
          }
        }
      ]
    );
  };

  const toggleNotifications = () => {
    setUserData(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  const togglePrivacy = () => {
    setUserData(prev => ({
      ...prev,
      privacy: !prev.privacy
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={editedUsername}
            onChangeText={setEditedUsername}
            placeholder="Enter username"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={editedEmail}
            onChangeText={setEditedEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleUpdateAccount}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Username: {userData.username}</Text>
          <Text style={styles.infoText}>Email: {userData.email}</Text>
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10
  },
  editSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    flex: 1
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  settingsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  toggleLabel: {
    fontSize: 16
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default Settings;