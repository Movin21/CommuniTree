import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const complaints = () => {

    const [formData, setFormData] = useState({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      issueInfo: '',
      issueTitle: '',
      issueDescription: '',
      issueLocation: '',
      preferredContact: '',
    });
  
    const handleInputChange = (field: string, value: string) => {
      setFormData(prevState => ({ ...prevState, [field]: value }));
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
              onChangeText={(text) => handleInputChange('firstname', text)}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="mb-1 text-gray-600">Lastname</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-md"
              value={formData.lastname}
              onChangeText={(text) => handleInputChange('lastname', text)}
            />
          </View>
        </View>
        
        {['Phone', 'Email', 'Issue Information', 'Issue Title', 'Issue Description', 'Issue Location', 'preferred method of contact'].map((field) => (
          <View key={field} className="mb-4">
            <Text className="mb-1 text-gray-600">{field}</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-md"
              multiline={field === 'Issue Description'}
              numberOfLines={field === 'Issue Description' ? 3 : 1}
              value={formData[field.toLowerCase().replace(/ /g, '') as keyof typeof formData]}
              onChangeText={(text) => handleInputChange(field.toLowerCase().replace(/ /g, ''), text)}
            />
          </View>
        ))}

        <TouchableOpacity className="flex-row items-center justify-center mb-4">
          <View className="w-10 h-10 bg-gray-200 rounded-md items-center justify-center mr-2">
            <Ionicons name="camera" size={24} color="black" />
          </View>
          <Text className="text-blue-500">Add Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center">
          <Text className="text-white font-bold font-inter">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>

  );
};
export default complaints;
