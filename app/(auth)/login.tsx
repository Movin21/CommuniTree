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
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";
import {
  checkSession,
  deleteCurrentSession,
  getCurrentUser,
  logIn,
} from "@/lib/appwrite";
import LoadingAnimation from "@/components/LoadingAnimation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);

  const modalContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
      backgroundColor: `rgba(0,0,0,${modalOpacity.value * 0.3})`,
    };
  });

  const modalContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
    };
  });

  const animateModal = (show) => {
    modalOpacity.value = withTiming(show ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    modalScale.value = withSpring(show ? 1 : 0.8, {
      damping: 15,
      stiffness: 150,
    });
  };
  useEffect(() => {
    animateModal(showErrorModal || showWarningModal);
  }, [showErrorModal, showWarningModal]);

  const navigateUser = (user: Models.User<Models.Preferences>) => {
    if (user && user.email) {
      if (user.email.toLowerCase().includes("ad")) {
        router.replace("/adminDashboard");
      } else {
        router.replace("/(tabs)/home");
      }
    } else {
      console.error("Invalid user object:", user);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage("Please enter both email and password.");
      setShowWarningModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const existingSession = await checkSession();
      if (existingSession) {
        await deleteCurrentSession();
      }

      const session = await logIn(email, password);
      const user = await getCurrentUser();

      if (user) {
        setLoginSuccess(true);
        // Wait for animation to complete before navigating
        setTimeout(() => {
          navigateUser(user);
        }, 1500);
      } else {
        throw new Error("Failed to get user information");
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("Please check your credentials and try again.");
      setShowErrorModal(true);
    } finally {
      // Don't set isLoading to false immediately if login was successful
      if (!loginSuccess) {
        setIsLoading(false);
      }
    }
  }; // Added closing bracket here

  const handleResetPassword = () => {
    if (email.trim() === "") {
      setModalMessage("Please enter your email in the login form first.");
      setShowWarningModal(true);
    } else {
      setModalMessage(
        `A confirmation email will be sent to ${email} for verification.`
      );
      setShowWarningModal(true);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const ErrorModal = () => (
    <Modal
      visible={showErrorModal}
      transparent={true}
      onRequestClose={() => setShowErrorModal(false)}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          modalContainerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              width: "80%",
            },
            modalContentStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: "#ef4444",
              borderRadius: 40,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Feather name="alert-triangle" size={32} color="white" />
          </View>
          <Text
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Error
          </Text>
          <Text
            style={{
              fontFamily: "Karla",
              fontSize: 16,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {modalMessage}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => setShowErrorModal(false)}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontWeight: "bold",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const WarningModal = () => (
    <Modal
      visible={showWarningModal}
      transparent={true}
      onRequestClose={() => setShowWarningModal(false)}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          modalContainerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              width: "80%",
            },
            modalContentStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: "#eab308",
              borderRadius: 40,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Feather name="alert-circle" size={32} color="white" />
          </View>
          <Text
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Warning
          </Text>
          <Text
            style={{
              fontFamily: "Karla",
              fontSize: 16,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {modalMessage}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#eab308",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => setShowWarningModal(false)}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontWeight: "bold",
              }}
            >
              Okay
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

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
            className="border shadow-2xl border-white rounded-md p-2 text-base font-inter bg-gray-100"
            value={email}
            onChangeText={setEmail}
            placeholder="email@communiTree.com"
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
              className="flex-1 p-2 text-base font-inter"
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
            <Link href="/signup">
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
          <Text className="text-white text-lg font-inter font-semibold">
            {isLoading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <View className="items-center mt-5">
          <TouchableOpacity onPress={handleResetPassword} disabled={isLoading}>
            <Text className="text-greyColor underline text-sm font-inter">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ErrorModal />
      <WarningModal />
      <LoadingAnimation visible={isLoading} isSuccess={loginSuccess} />
    </SafeAreaView>
  );
};

export default LoginForm;
