import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
import { createComplaint } from "../../lib/appwrite";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Complaints = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    issuetitle: "",
    description: "",
    location: "",
    contact: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createComplaint(formData);
      Alert.alert("Success", "Your issue has been submitted successfully!");
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        issuetitle: "",
        description: "",
        location: "",
        contact: "",
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error submitting your issue. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={{  paddingBottom: 100 ,padding:15 }}>
        <Text className="text-2xl font-bold mb-4">Report Your Issue</Text>
        
        <View className="flex-row mb-3">
          <View className="flex-1 mr-2">
            <Text className="text-xs text-gray-600 mb-1">First Name</Text>
            <TextInput
              className="bg-gray-100 p-2 rounded-md text-sm"
              value={formData.firstname}
              onChangeText={(text) => handleInputChange("firstname", text)}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-xs text-gray-600 mb-1">Last Name</Text>
            <TextInput
              className="bg-gray-100 p-2 rounded-md text-sm"
              value={formData.lastname}
              onChangeText={(text) => handleInputChange("lastname", text)}
            />
          </View>
        </View>

        <View className="mb-3">
          <Text className="text-xs text-gray-600 mb-1">Phone</Text>
          <TextInput
            className="bg-gray-100 p-2 rounded-md text-sm"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-3">
          <Text className="text-xs text-gray-600 mb-1">Email</Text>
          <TextInput
            className="bg-gray-100 p-2 rounded-md text-sm"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
          />
        </View>

        {[
          { label: "Issue Title", field: "issuetitle" },
          { label: "Issue Location", field: "location" },
          { label: "Preferred Contact Method", field: "contact" },
        ].map(({ label, field }) => (
          <View key={field} className="mb-3">
            <Text className="text-xs text-gray-600 mb-1">{label}</Text>
            <TextInput
              className="bg-gray-100 p-2 rounded-md text-sm"
              value={formData[field as keyof typeof formData]}
              onChangeText={(text) => handleInputChange(field, text)}
            />
          </View>
        ))}

        <View className="mb-3">
          <Text className="text-xs text-gray-600 mb-1">Issue Description</Text>
          <TextInput
            className="bg-gray-100 p-2 rounded-md text-sm"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
          />
        </View>

        <TouchableOpacity className="flex-row items-center mb-4">
          <View className="w-8 h-8 bg-gray-200 rounded-md items-center justify-center mr-2">
            <Ionicons name="camera" size={20} color="black" />
          </View>
          <Text className="text-blue-500 text-sm">Add Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
            className="bg-primaryColor p-4 rounded-lg items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold font-inter">Submit</Text>
          </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Complaints;