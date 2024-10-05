import React, { useState } from "react";
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

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    if (email.toLowerCase().includes("ad")) {
      // Navigate to NewScreen if 'ad' is found
      router.push("/adminDashboard"); // Navigates to the new page
    } else {
      router.push("/(tabs)/home"); // Navigates to the new page
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

        <View className="items-center mt-5">
          <TouchableOpacity>
            <Link href="/forgotPassword">
              <Text className="text-greyColor underline text-sm font-inter">
                Forgot Password?
              </Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginForm;
