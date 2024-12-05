import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "https://quizwhiz-backend-679124120937.us-central1.run.app";

const UpdateModal = ({
  visible,
  onClose,
  updateForm,
  setUpdateForm,
  onUpdate,
}) => (
  <Modal
    transparent
    visible={visible}
    onRequestClose={onClose}
    animationType="slide"
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContainer, styles.updateModalContainer]}>
        <Text style={styles.modalTitle}>Update User</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={updateForm.username}
          onChangeText={(text) =>
            setUpdateForm((prev) => ({ ...prev, username: text }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={updateForm.email}
          onChangeText={(text) =>
            setUpdateForm((prev) => ({ ...prev, email: text }))
          }
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="New Password (optional)"
          value={updateForm.password}
          onChangeText={(text) =>
            setUpdateForm((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={updateForm.bio}
          onChangeText={(text) =>
            setUpdateForm((prev) => ({ ...prev, bio: text }))
          }
          multiline
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.updateButton]}
            onPress={onUpdate}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const UserActionModal = ({
  visible,
  onClose,
  selectedUser,
  onUpdate,
  onDelete,
}) => (
  <Modal
    transparent
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalEmail}>{selectedUser?.email}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.updateModalButton]}
            onPress={() => {
              onClose();
              onUpdate();
            }}
          >
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.deleteModalButton]}
            onPress={() => {
              onClose();
              onDelete(); 
            }}
          >
            <LinearGradient
              colors={["#ff4b4b", "#ff0000", "#cc0000"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Modal>
);

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(`${BACKEND_URL}/users/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.message === "No access token found") {
        setError("Please log in to access this feature.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        await AsyncStorage.removeItem("accessToken");
      } else {
        setError("Failed to load users. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const updateData = Object.entries(updateForm).reduce(
        (acc, [key, value]) => {
          if (value && value.trim() !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      updateData.user_id = selectedUser.id;

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

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setUpdateModalVisible(false);
      setModalVisible(false);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to update user"
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(`${BACKEND_URL}/users/delete`, {
        data: { user_id: selectedUser.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUsers(users.filter((user) => user.id !== selectedUser.id));
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to delete user"
      );
    }
  };

  const handleOpenUpdateModal = () => {
    setUpdateForm({
      username: selectedUser?.username || "",
      email: selectedUser?.email || "",
      password: "",
      bio: selectedUser?.bio || "",
    });
    setUpdateModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.userCard} onPress={() => handleUserAction(item)}>
      <Text style={styles.emailText} numberOfLines={1} ellipsizeMode="tail">
        {item.email}
      </Text>
      <Text style={styles.moreText}>•••</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#4158D0", "#C850C0", "#FFCC70"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Admin Dashboard</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4158D0" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={true}
            style={styles.flatList}
          />
        )}

        <UserActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedUser={selectedUser}
          onUpdate={handleOpenUpdateModal}
          onDelete={handleDeleteUser} 
        />

        <UpdateModal
          visible={updateModalVisible}
          onClose={() => setUpdateModalVisible(false)}
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          onUpdate={handleUpdateUser}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  moreText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalEmail: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4158D0",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  updateModalContainer: {
    width: "90%",
    maxHeight: "80%",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
  },

  updateButton: {
    backgroundColor: "#3b82f6",
  },
});

export default Admin;
