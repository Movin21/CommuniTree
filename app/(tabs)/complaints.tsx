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
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
import { createComplaint } from "../../lib/appwrite";
import * as ImagePicker from 'expo-image-picker';

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
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };
   
  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setPhoto(pickerResult.assets[0]);
      // console.log("Photo selected:", pickerResult.assets[0]);
    } else {
      console.log("Photo selection canceled or failed");
    }
  };

  const handleSubmit = async () => {
    try {
      
      
      const complaintData = { ...formData};
      console.log("Submitting complaint data:");
      
      await createComplaint(complaintData);
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
      setPhoto(null);
    } catch (error) {
      console.error("Error submitting complaint:", error);
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

        <TouchableOpacity 
          className="flex-row items-center mb-4"
          onPress={handleChoosePhoto}
        >
          <View className="w-8 h-8 bg-gray-200 rounded-md items-center justify-center mr-2">
            <Ionicons name="camera" size={20} color="black" />
          </View>
          <Text className="text-blue-500 text-sm">
            {photo ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>

        {photo && photo.uri && (
          <View className="mb-4">
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
            <Text className="text-xs text-gray-600 mt-2">Selected photo</Text>
          </View>
        )}

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