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
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [residenceNumber, setResidenceNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const residenceOptions = [
    "Apartment Complex",
    "Housing Scheme",
    "Condominium",
  ];

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted");
  };

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
                  borderColor: "white",
                  borderWidth: 1,
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
                  borderColor: "white",
                  borderWidth: 1,
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
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="yourmail@shrestha.com"
              placeholderTextColor="black"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-4">
            <TextInput
              style={{
                fontFamily: "Karla",
                borderColor: "white",
                borderWidth: 1,
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
                borderColor: "white",
                borderWidth: 1,
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
                borderColor: "white",
                borderWidth: 1,
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

          <Text className="text-sm text-center mt-14 text-gray-600 font-inter">
            By Submitting, I agree to communitree{"\n"}
            <Link href="/TermsOfServiceScreen">
              <Text className="text-primaryColor underline">
                Terms of Services
              </Text>
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomDropdown />
    </SafeAreaView>
  );
};

export default SignUpForm;
