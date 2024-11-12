import React, { useState } from "react";
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
import axiosInstance from "../../api/instance";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768;

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

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email";
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

      //   const response = await axiosInstance.post('auth/login', {
      //     email: email.trim(),
      //     password: password.trim(),
      //   });

      //   await AsyncStorage.setItem('authToken', response.data.token);
      router.push("/homepage")
    } catch (error) {
      setErrors({
        general:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred during login",
      });
    } finally {
      console.log(errors);
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signUp")
  };

  const renderForm = () => (
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Welcome Back</Text>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && errorStyles.inputError]}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: "", general: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {errors.email && (
            <Text style={errorStyles.errorText}>{errors.email}</Text>
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
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.textField}>New User?</Text>
        <TouchableOpacity
          style={[styles.signUpButton, isLoading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.textField}>Create Your Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    webFormContainer: {
      flex: 0.4,
      padding: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    formWrapper: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: "#ffffff",
      padding: 32,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
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
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 40,
      color: "#1e293b",
      textAlign: "center",
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
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
      shadowColor: "#2563eb",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
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
      fontSize: 14,
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
