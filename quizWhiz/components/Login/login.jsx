import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768;

  const styles = StyleSheet.create({
    signUpContainer: {
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    container: {
      flex: 1,
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    mobileLayout: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
      paddingTop: 170,
      paddingLeft: 6,
    },
    webLayout: {
      flex: 1,
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
    },
    formContainer: {
      flex: 0.4,
      padding: 24,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      borderRadius: 16,
      margin: 16,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      elevation: 4,
    },
    webFormContainer: {
      flex: 0.4,
      justifyContent: "center",
      alignItems: "center",
    },
    formWrapper: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: "#ffffff",
      padding: 32,
      borderRadius: 16,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      elevation: 4,
    },
    imageContainer: {
      flex: Platform.select({ web: 0.6, default: 0.6 }),
      overflow: "hidden",
      backgroundColor: "#000000",
    },
    image: {
      width: "100%",
      height: "100%",
      opacity: 0.8,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      marginBottom: 48,
      color: "#0f172a",
      textAlign: "center",
      letterSpacing: -0.5,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: "#475569",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      height: 48,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 8,
      paddingHorizontal: 16,
      backgroundColor: "#ffffff",
      fontSize: 16,
      color: "#1e293b",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      elevation: 1,
    },
    button: {
      width: "100%",
      height: 48,
      backgroundColor: "#2563eb",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      boxShadow: "0px 4px 4px rgba(37, 99, 235, 0.2)",
      elevation: 4,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.5,
    },
    textField: {
      color: "#475569",
      fontSize: 15,
    },
    signUptextField: {
      color: "#3b82f6",
      fontSize: 15,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    errorText: {
      color: "#dc2626",
      fontSize: 14,
      marginTop: 4,
      fontWeight: "500",
    },
    inputError: {
      borderColor: "#dc2626",
      borderWidth: 1.5,
    },
  });

  const errorStyles = StyleSheet.create({
    errorText: {
      color: "#DC2626",
      fontSize: 14,
      marginTop: 4,
    },
    inputError: {
      borderColor: "#DC2626",
    },
  });

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !isLoading) {
        handleLogin();
      }
    },
    [isLoading]
  );

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    handleLogin();
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!username.trim()) {
      tempErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        "https://quizwhiz-backend-679124120937.us-central1.run.app/users/login",
        {
          username: username.trim(),
          password: password.trim(),
        }
      );

      if (response.data.access && response.data.refresh) {
        await AsyncStorage.setItem("accessToken", response.data.access);
        await AsyncStorage.setItem("refreshToken", response.data.refresh);

        const userData = JSON.stringify(response.data.user);
        await AsyncStorage.setItem("userData", userData);
        console.log(response.data);
        router.replace("/homepage");
      }
    } catch (error) {
      setErrors({
        general:
          error?.response?.data?.error || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signUp");
  };

  const renderForm = () => (
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Welcome Back</Text>
      <View as="form" onSubmit={handleSubmit} style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, errors.username && errorStyles.inputError]}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors((prev) => ({ ...prev, username: "", general: "" }));
            }}
            autoCapitalize="none"
            editable={!isLoading}
            onSubmitEditing={handleSubmit} // Handle Enter on this input
          />
          {errors.username && (
            <Text style={errorStyles.errorText}>{errors.username}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && errorStyles.inputError]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: "", general: "" }));
            }}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleSubmit} // Handle Enter on this input
          />
          {errors.password && (
            <Text style={errorStyles.errorText}>{errors.password}</Text>
          )}
        </View>
        {errors.general && (
          <Text style={[errorStyles.errorText, { marginBottom: 10 }]}>
            {errors.general}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isLoading}
          tabIndex={0}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.textField}>New User?</Text>
        <TouchableOpacity
          style={isLoading && { opacity: 0.7 }}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUptextField}>Create Your Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isMobile) {
    return (
      <View style={styles.mobileLayout}>
        <View>{renderForm()}</View>
      </View>
    );
  }

  return (
    <View style={styles.webLayout}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/login.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.webFormContainer}>{renderForm()}</View>
    </View>
  );
};

export default Login;
