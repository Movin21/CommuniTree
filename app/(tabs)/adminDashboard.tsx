import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
const AdminDashboard = () => {
  return (
    <View className="flex-1" style={{ backgroundColor: "#F9F9F9" }}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          <View className="flex-row mb-6">
            <View className="flex-1 bg-white-100 rounded-lg p-8 ml-2 items-center justify-center shadow-md">
              <Ionicons name="calendar" size={32} color="black" />
              <Text className="mt-2  text-center font-inter">Add an Event</Text>
            </View>
            <View className="flex-1 bg-white-100 rounded-lg p-8 ml-2 items-center justify-center shadow-md">
              <Ionicons name="eye" size={32} color="#3b82f6" />
              <Text className="mt-2 text-center font-inter">Manage Reservations</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-bold mb-2 font-inter">Complaints</Text>
            <View className="bg-white rounded-lg shadow-md">
              <View className="flex-row border-b border-gray-200 py-2 px-4 font-inter">
                <Text className="font-bold flex-1 font-inter">Tenant</Text>
                <Text className="font-bold flex-1 font-inter">Complaints</Text>
              </View>
              {[
                { tenant: "Ramesh D.", complaint: "Water tank leackage..." },
                { tenant: "Cabin K.", complaint: "Elivator shaking ..." },
                { tenant: "Tylor S.", complaint: "Parking area is ..." },
                { tenant: "Micheal J.", complaint: "No water since mon..." },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row border-b border-gray-200 py-2 px-4"
                >
                  <Text className="flex-1">{item.tenant}</Text>
                  <Text className="flex-1 text-gray-600">{item.complaint}</Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-xl font-bold mb-2 font-inter">Interruption Alert</Text>
            <View className="bg-gray-100 rounded-lg p-4">
              <View className="flex-row justify-between mb-2">
                <View className="flex-1 mr-2">
                  <Text className="font-bold mb-1 font-inter">ID</Text>
                  <TextInput
                    className="bg-white p-2 rounded-md"
                    placeholder="Enter ID"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="font-bold mb-1 font-inter">severity</Text>
                  <View className="bg-white p-2 rounded-md flex-row justify-between items-center">
                    <Text>Select</Text>
                    <Ionicons name="chevron-down" size={16} color="black" />
                  </View>
                </View>
              </View>
              <View className="mb-4">
                <Text className="font-bold mb-1 font-inter">Alert Description</Text>
                <TextInput
                  className="bg-white p-2 rounded-md"
                  placeholder="Enter alert description"
                  multiline
                />
              </View>
              <TouchableOpacity className="bg-primaryColor p-2  rounded-lg items-center">
                <Text className="text-white font-bold font-inter">SEND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
