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
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [residenceNumber, setResidenceNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const residenceOptions = [
    "Apartment Complex",
    "Housing Scheme",
    "Condominium",
  ];

  const checkmarkProgress = useSharedValue(0);
  const crossmarkProgress = useSharedValue(0);

  const checkmarkStyle = useAnimatedStyle(() => ({
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: checkmarkProgress.value }],
  }));

  const checkmarkPath = useAnimatedStyle(() => ({
    height: 12,
    width: 6,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "white",
    transform: [{ rotate: "45deg" }, { scale: checkmarkProgress.value }],
  }));

  const crossmarkStyle = useAnimatedStyle(() => ({
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: crossmarkProgress.value }],
  }));

  useEffect(() => {
    if (showSuccessModal) {
      checkmarkProgress.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      checkmarkProgress.value = 0;
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (showErrorModal) {
      crossmarkProgress.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      crossmarkProgress.value = 0;
    }
  }, [showErrorModal]);

  const validateForm = () => {
    let errorMessages = [];

    if (!firstName.trim()) {
      errorMessages.push("First name is required");
    }
    if (!lastName.trim()) {
      errorMessages.push("Last name is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errorMessages.push("Email is required");
    } else if (!emailRegex.test(email)) {
      errorMessages.push("Please enter a valid email");
    }

    if (!residenceNumber.trim()) {
      errorMessages.push("Residence number is required");
    }

    const phoneRegex = /^\d{10}$/;
    if (!contactNumber.trim()) {
      errorMessages.push("Contact number is required");
    } else if (!phoneRegex.test(contactNumber)) {
      errorMessages.push("Please enter a valid 10-digit phone number");
    }

    if (!residenceType) {
      errorMessages.push("Please select a residence type");
    }

    setErrors(errorMessages);
    return errorMessages.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const ErrorModal = () => (
    <Modal
      visible={showErrorModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowErrorModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            width: "80%",
          }}
        >
          <View
            style={{
              backgroundColor: "#ef4444",
              borderRadius: 40,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Animated.View style={crossmarkStyle}>
              <View
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: "white",
                  position: "absolute",
                  transform: [{ rotate: "45deg" }],
                }}
              />
              <View
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: "white",
                  position: "absolute",
                  transform: [{ rotate: "-45deg" }],
                }}
              />
            </Animated.View>
          </View>
          <Text
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
              color: "#ef4444",
            }}
          >
            Validation Error
          </Text>
          <ScrollView style={{ maxHeight: 150 }}>
            {errors.map((error, index) => (
              <Text
                key={index}
                style={{
                  fontFamily: "Karla",
                  fontSize: 16,
                  marginBottom: 8,
                  textAlign: "center",
                  color: "#4b5563",
                }}
              >
                • {error}
              </Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 20,
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
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const CustomDropdown = () => (
    <Modal
      visible={showDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setShowDropdown(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 10,
            width: "80%",
          }}
        >
          {residenceOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 15,
                borderBottomWidth: index < residenceOptions.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
              onPress={() => {
                setResidenceType(option);
                setShowDropdown(false);
              }}
            >
              <Text style={{ fontFamily: "Karla", fontSize: 16 }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            width: "80%",
          }}
        >
          <View
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 40,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Animated.View style={checkmarkStyle}>
              <Animated.View style={checkmarkPath} />
            </Animated.View>
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
            Success
          </Text>
          <Text
            style={{
              fontFamily: "Karla",
              fontSize: 16,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Your credentials will be received shortly
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => {
              setShowSuccessModal(false);
              router.push("/login");
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter",
                fontWeight: "bold",
              }}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-start px-10 pt-16"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-2">
            <Image
              source={require("../../assets/logo.png")}
              className="w-40 h-40"
            />
          </View>

          <Text className="text-2xl font-Inter font-semibold mb-6 text-center">
            New Account Request
          </Text>

          <View className="flex-row mb-4 justify-between">
            <View className="flex-1 mr-1">
              <TextInput
                style={{
                  fontFamily: "Karla",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                }}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Firstname"
                placeholderTextColor="black"
              />
            </View>
            <View className="flex-1 ml-1">
              <TextInput
                style={{
                  fontFamily: "Karla",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                }}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Lastname"
                placeholderTextColor="black"
              />
            </View>
          </View>

          <View className="mb-4">
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="yourmail@communiTree.com"
              placeholderTextColor="black"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-4">
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={residenceNumber}
              onChangeText={setResidenceNumber}
              placeholder="Residence Number"
              placeholderTextColor="black"
            />
          </View>

          <View className="mb-4">
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Contact Number"
              placeholderTextColor="black"
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-4 mt-4">
            <Text className="text-xs font-inter font-semibold text-greyColor mb-2 tracking-widest ml-2">
              TYPE OF RESIDENCE
            </Text>
            <TouchableOpacity
              style={{
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => setShowDropdown(true)}
            >
              <Text
                style={{
                  color: "black",
                  fontFamily: "Karla",
                }}
              >
                {residenceType || "Select Residence Type"}
              </Text>
              <Feather name="chevron-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-blue-800 py-2 px-2 rounded-md items-center mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-inter font-semibold">
              Submit
            </Text>
          </TouchableOpacity>

          <View className="items-center mt-6">
            <Text className="text-base text-black font-inter">
              back to{" "}
              <Link href="/login">
                <Text className="text-primaryColor font-inter font-bold text-base underline">
                  login
                </Text>
              </Link>
            </Text>
          </View>
          <View>
            <Text className="text-sm text-center mt-10 text-gray-600 font-inter">
              By Submitting, I agree to communitree{"\n"}
              <Link href="/TermsOfServiceScreen">
                <Text className="text-primaryColor underline">
                  Terms of Services
                </Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomDropdown />
      <SuccessModal />
      <ErrorModal />
    </SafeAreaView>
  );
};

export default SignUpForm;
