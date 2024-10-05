import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import {
  logIn,
  getCurrentUser,
  checkSession,
  deleteCurrentSession,
} from "../../lib/appwrite";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const session = await checkSession();
      if (session) {
        // Session exists, navigate to appropriate screen
        const user = await getCurrentUser();
        navigateUser(user);
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const navigateUser = (user) => {
    if (user.email.toLowerCase().includes("ad")) {
      router.push("/adminDashboard");
    } else {
      router.push("/(tabs)/home");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Check for existing session
      const existingSession = await checkSession();
      if (existingSession) {
        // Delete the existing session before creating a new one
        await deleteCurrentSession();
      }

      // Now proceed with login
      const session = await logIn(email, password);
      const user = await getCurrentUser();

      if (user) {
        navigateUser(user);
      } else {
        throw new Error("Failed to get user information");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-start px-5 pt-16"
      >
        <View className="flex-row justify-between items-center relative">
          <Image
            source={require("../../assets/logo.png")}
            className="w-40 h-40"
          />
          <TouchableOpacity className="absolute top-0 right-0">
            <Text className="text-primaryColor font-inter font-bold text-2xl">
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-start mb-12">
          <Text className="text-2xl font-inter font-bold tracking-wider">
            Welcome to
          </Text>
          <Text className="text-4xl font-inter font-bold mb-7 tracking-wider">
            CommuniTree!
          </Text>
        </View>

        <View className="mb-5">
          <Text className="text-xs font-inter font-semibold text-greyColor mb-2 tracking-widest">
            EMAIL
          </Text>
          <TextInput
            className="border shadow-2xl border-white rounded-md p-2 text-lg font-inter bg-gray-100"
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor="#7D7F88"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        <View className="mb-5">
          <Text className="text-xs font-inter font-semibold text-greyColor mb-2 tracking-widest">
            PASSWORD
          </Text>
          <View className="flex-row items-center border border-white rounded-md bg-gray-100">
            <TextInput
              className="flex-1 p-2 text-lg font-inter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#7D7F88"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="p-2"
              disabled={isLoading}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text className="text-md text-black font-semibold font-inter mt-2">
            Don't have an account?{" "}
            <Link href="/signUp">
              <Text className="text-blue-600 font-inter">Sign Up</Text>
            </Link>
          </Text>
        </View>

        <TouchableOpacity
          className={`bg-blue-800 py-2 px-2 rounded-md items-center mt-3 ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-lg font-interfont-semibold">
            {isLoading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        {/* Rest of the component remains the same */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginForm;
