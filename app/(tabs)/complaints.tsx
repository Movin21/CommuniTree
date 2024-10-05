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
import { database, appwriteConfig, ID } from "../../lib/appwrite";
NativeWindStyleSheet.setOutput({
  default: "native",
});

const complaints = () => {
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
      const response = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.issueCollectionId,
        ID.unique(),
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          email: formData.email,
          issuetitle: formData.issuetitle,
          description: formData.description,
          location: formData.location,
          contact: formData.contact,
        
        }
      );
      console.log("Issue submitted successfully");
      Alert.alert("Success", "Your issue has been submitted successfully!");
      // Reset form after successful submission
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
      console.error("Error submitting issue:", error);
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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-1 text-gray-600">Firstname</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-md"
                value={formData.firstname}
                onChangeText={(text) => handleInputChange("firstname", text)}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-1 text-gray-600">Lastname</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-md"
                value={formData.lastname}
                onChangeText={(text) => handleInputChange("lastname", text)}
              />
            </View>
          </View>

          {[
            { label: "Phone", field: "phone" },
            { label: "Email", field: "email" },
            { label: "Issue Title", field: "issuetitle" },
            { label: "Issue Description", field: "description" },
            { label: "Issue Location", field: "location" },
            { label: "Preferred method of contact", field: "contact" },
          ].map(({ label, field }) => (
            <View key={field} className="mb-4">
              <Text className="mb-1 text-gray-600">{label}</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-md"
                multiline={field === "description"}
                numberOfLines={field === "description" ? 3 : 1}
                value={formData[field as keyof typeof formData]}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            </View>
          ))}

          <TouchableOpacity className="flex-row items-center justify-center mb-4">
            <View className="w-10 h-10 bg-gray-200 rounded-md items-center justify-center mr-2">
              <Ionicons name="camera" size={24} color="black" />
            </View>
            <Text className="text-blue-500">Add Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primaryColor p-4 rounded-lg items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold font-inter">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default complaints;
