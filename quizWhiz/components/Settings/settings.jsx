import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const BACKEND_URL = "https://quizwhiz-backend-679124120937.us-central1.run.app";

const Settings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      setIsEditing(false);
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        setUpdateForm({
          username: parsedUserData.username || "",
          email: parsedUserData.email || "",
          password: "",
          bio: parsedUserData.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const updateData = Object.entries(updateForm).reduce(
        (acc, [key, value]) => {
          if (value && value.trim() !== "" && value !== userData[key]) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      updateData.user_id = userData.id;

      const response = await axios.patch(
        `${BACKEND_URL}/users/update`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await AsyncStorage.setItem("userData", JSON.stringify(response.data));
      setUserData(response.data);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(`${BACKEND_URL}/users/delete`, {
        data: { user_id: userData.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await AsyncStorage.clear();
      router.replace("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      {isEditing ? (
        <View style={styles.editSection}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={updateForm.username}
            onChangeText={(text) =>
              setUpdateForm((prev) => ({ ...prev, username: text }))
            }
            placeholder="Enter username"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={updateForm.email}
            onChangeText={(text) =>
              setUpdateForm((prev) => ({ ...prev, email: text }))
            }
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>New Password (optional)</Text>
          <TextInput
            style={styles.input}
            value={updateForm.password}
            onChangeText={(text) =>
              setUpdateForm((prev) => ({ ...prev, password: text }))
            }
            placeholder="Enter new password"
            secureTextEntry
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={updateForm.bio}
            onChangeText={(text) =>
              setUpdateForm((prev) => ({ ...prev, bio: text }))
            }
            placeholder="Enter bio"
            multiline
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateAccount}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setUpdateForm({
                  username: userData.username || "",
                  email: userData.email || "",
                  password: "",
                  bio: userData.bio || "",
                });
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Username: {userData?.username}</Text>
          <Text style={styles.infoText}>Email: {userData?.email}</Text>
          {userData?.bio && (
            <Text style={styles.infoText}>Bio: {userData.bio}</Text>
          )}

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
        disabled={loading}
      >
        <Text style={styles.deleteButtonText}>
          {loading ? "Processing..." : "Delete Account"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  infoSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4a5568",
  },
  editSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#4a5568",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Settings;
