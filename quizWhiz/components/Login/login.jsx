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
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();

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
      navigation.replace("about");
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
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      minHeight: "100vh",
    },
    mobileLayout: {
      flex: 1,
    },
    webLayout: {
      flex: 1,
      flexDirection: "row",
      minHeight: "100vh",
    },
    formContainer: {
      flex: 0.4,
      padding: 20,
      justifyContent: "center",
    },
    webFormContainer: {
      flex: 0.4,
      padding: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    formWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    imageContainer: {
      flex: Platform.select({ web: 0.6, default: 0.6 }),
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 40,
      color: "black",
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
      color: "black",
    },
    input: {
      width: "100%",
      height: 44,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 6,
      paddingHorizontal: 16,
      backgroundColor: "white",
      fontSize: 16,
    },
    button: {
      width: "100%",
      height: 44,
      backgroundColor: "#2563EB",
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  if (isMobile) {
    return (
      <View style={styles.mobileLayout}>
        <View style={styles.formContainer}>{renderForm()}</View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/login.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
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
