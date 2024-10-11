import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
import { fetchComplaints, createInterruptionAlert } from "../../lib/appwrite";

NativeWindStyleSheet.setOutput({
  default: "native",
});

interface Complaint {
  firstname: string;
  issuetitle: string;
  $id: string;
}
const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [id, setid] = useState("");
  const [alertdescription, setalertdescription] = useState("");
  const [severity, setSeverity] = useState("low");

  useEffect(() => {
    const getComplaints = async () => {
      try {
        const fetchedComplaints = await fetchComplaints();
        setComplaints(fetchedComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    getComplaints();
  }, []);
  const handleSendInterruption = async () => {
    if (!id || !alertdescription || !severity) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await createInterruptionAlert(id, alertdescription,severity);
      Alert.alert("Success", "Interruption alert sent successfully");
      setid("");
      setalertdescription("");
      setSeverity("low");
    } catch (error) {
      Alert.alert("Error", "Failed to send interruption alert");
    }
  };


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
              {complaints.map((item) => (
                <View
                  key={item.$id}
                  className="flex-row border-b border-gray-200 py-2 px-4"
                >
                  <Text className="flex-1">{item.firstname}</Text>
                  <Text className="flex-1 text-gray-600">{item.issuetitle}</Text>
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
                    value={id}
                    onChangeText={setid}
                  />
                </View>
                <View className="flex-1 ml-2">
                <Text className="font-bold mb-1 font-inter ">Severity</Text>
                <Picker
                  selectedValue={severity}
                  onValueChange={(itemValue) => setSeverity(itemValue)}
                  className="bg-white p-2 rounded-md"
                >
                  <Picker.Item label="Low" value="low" />
                  <Picker.Item label="Medium" value="medium" />
                  <Picker.Item label="High" value="high" />
                </Picker>
              </View>
            </View>
              <View className="mb-4">
                <Text className="font-bold mb-1 font-inter">Alert Description</Text>
                <TextInput
                  className="bg-white p-2 rounded-md"
                  placeholder="Enter alert description"
                  multiline
                  value={alertdescription}
                  onChangeText={setalertdescription}
                />
              </View>
              <TouchableOpacity
                className="bg-primaryColor p-2 rounded-lg items-center"
                onPress={handleSendInterruption}
              >
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