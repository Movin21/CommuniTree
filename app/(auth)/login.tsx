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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styled } from "nativewind";
import { router } from "expo-router";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [residenceNumber, setResidenceNumber] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    console.log("Login attempted with:", residenceNumber, password);

    // Check if 'residenceNumber' contains 'ad'
    if (residenceNumber.toLowerCase().includes("ad")) {
      // Navigate to NewScreen if 'ad' is found
      router.push("/adminDashboard"); // Navigates to the new page
    } else {
      router.push("/(tabs)/home"); // Navigates to the new page
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-start px-5 pt-16"
      >
        <StyledView className="flex-row justify-between items-center relative">
          <StyledImage
            source={require("../../assets/logo.png")} // Update path as needed
            className="w-40 h-40 "
          />
          <StyledTouchableOpacity className="absolute top-0 right-0">
            <StyledText className="text-primaryColor font-inter font-bold text-2xl">
              Login
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        <StyledView className="items-start mb-12">
          <StyledText className="text-2xl font-inter font-bold tracking-wider">
            Welcome to
          </StyledText>
          <StyledText className="text-4xl font-inter font-bold mb-7 tracking-wider">
            CommuniTree!
          </StyledText>
        </StyledView>

        <StyledView className="mb-5">
          <StyledText className="text-xs font-inter font-semibold text-greyColor mb-2 tracking-widest">
            RESIDENCE NUMBER
          </StyledText>
          <StyledTextInput
            className="border shadow-2xl border-white rounded-md p-2 text-lg font-inter bg-gray-100"
            value={residenceNumber}
            onChangeText={setResidenceNumber}
            placeholder="1098/2A/07BC"
            placeholderTextColor="#7D7F88"
            keyboardType="default"
            autoCapitalize="characters"
            autoCorrect={false}
            editable={true}
          />
        </StyledView>

        <StyledView className="mb-5">
          <StyledText className="text-xs font-inter font-semibold text-greyColor mb-2 tracking-widest">
            PASSWORD
          </StyledText>
          <StyledView className="flex-row items-center border border-white rounded-md bg-gray-100">
            <StyledTextInput
              className="flex-1 p-2 text-lg font-inter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#7D7F88"
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
            />
            <StyledTouchableOpacity
              onPress={togglePasswordVisibility}
              className="p-2"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledText className="text-md text-black font-semibold font-inter mt-2">
            Don't you have an account?
            <StyledText className="text-blue-600 font-inter">
              Sign In
            </StyledText>
          </StyledText>
        </StyledView>

        <StyledTouchableOpacity
          className="bg-blue-800 py-2 px-2 rounded-md items-center mt-3"
          onPress={handleLogin}
        >
          <StyledText className="text-white text-lg font-inter font-semibold">
            Log In
          </StyledText>
        </StyledTouchableOpacity>

        <StyledView className="items-center mt-5">
          <StyledTouchableOpacity>
            <StyledText className="text-greyColor text-sm font-inter">
              Forgot Password?
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default LoginForm;
