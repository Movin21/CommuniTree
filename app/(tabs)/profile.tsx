import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEditProfile = () => {
    console.log("Edit Profile Button Clicked");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    // You can add any additional logic for editing the profile here
  };

  const handleResetPassword = () => {
    console.log("Reset Password Button Clicked");
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    // You can add logic to handle the password reset here
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-10">
          <View className="items-center mt-6">
            <Image
              source={require("../../assets/logo.png")}
              className="w-24 h-24 rounded-full bg-purple-200"
            />
            <Text className="tracking-wider mt-4 text-xl font-bold font-inter">
              Bimal Rajapakse
            </Text>
            <Text className="text-gray-500 font-karla mb-6">
              bimalrj291@gmail.com
            </Text>
          </View>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <TextInput
                style={{
                  fontFamily: "Karla",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                }}
                placeholder="Bimal" // Set placeholder
                value={firstName}
                onChangeText={setFirstName} // Update state on change
                className="text-gray-500"
              />
            </View>
            <View className="flex-1 ml-2">
              <TextInput
                style={{
                  fontFamily: "Karla",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                }}
                placeholder="Rajapakse" // Set placeholder
                value={lastName}
                onChangeText={setLastName} // Update state on change
                className="text-gray-500"
              />
            </View>
          </View>

          <TextInput
            style={{
              fontFamily: "Karla",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#F3F4F6",
              marginBottom: 16,
            }}
            placeholder="bimalrj291@gmail.com" // Set placeholder
            value={email}
            onChangeText={setEmail} // Update state on change
            className="text-gray-500"
          />

          <TouchableOpacity
            onPress={handleEditProfile} // Added onPress handler
            className="bg-blue-800 py-3 rounded-lg items-center mt-2"
          >
            <Text className="text-white font-semibold font-inter">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <View className="mt-8">
            <Text className="text-gray-400 font-inter text-xs font-semibold tracking-wider mb-4">
              RESET PASSWORD
            </Text>

            <Text className="text-gray-500 font-karla mb-1">Old Password</Text>
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
                marginBottom: 16,
              }}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter old password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />

            <Text className="text-gray-500 font-karla mb-1">New Password</Text>
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
                marginBottom: 16,
              }}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />

            <TouchableOpacity
              onPress={handleResetPassword} // Added onPress handler
              className="bg-blue-800 py-3 rounded-lg items-center"
              style={{ width: "40%" }}
            >
              <Text className="text-white font-semibold font-inter">Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
