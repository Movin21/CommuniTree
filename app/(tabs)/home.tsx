import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ColorList from "../../components/ColorList";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
import {fetchInterruptionAlerts ,fetchComplaints,getCurrentUser } from "../../lib/appwrite";

NativeWindStyleSheet.setOutput({
  default: "native",
});
interface InterruptionAlert {
  $id: string;
  id: string;
  alertdescription: string;
}
const Home = () => {
  const [interruptionAlerts, setInterruptionAlerts] = useState<InterruptionAlert[]>([]);
  const [complaintCount, setComplaintCount] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getInterruptionAlerts = async () => {
      try {
        const alerts = await fetchInterruptionAlerts();
        setInterruptionAlerts(alerts);

        const complaints = await fetchComplaints();
        setComplaintCount(complaints.length);

        const user = await getCurrentUser();
        setUserName(user.name || "User"); 

      } catch (error) {
        console.error("Error fetching interruption alerts:", error);
      }
    };

    getInterruptionAlerts();
  }, []);

  const getSeverityColor = (index: number) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <ScrollView>
      <View className="flex-1 bg-white mt-0">
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="p-4">
            <Text className="text-2xl font-bold mb-4 font-inter">
            Welcome, {userName}
            </Text>

            <View className="flex-row mb-4">
              <TouchableOpacity
                className="flex-1 p-4 rounded-lg mr-2"
                style={{ backgroundColor: "#0D483C" }}
              >
                <Text className="text-white font-bold font-inter">
                  Event Notifications
                </Text>
                <View className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-green-700 font-bold">8</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 p-4 rounded-lg ml-2"
                style={{ backgroundColor: "#7A453E" }}
              >
                <Text className="text-white font-bold font-inter ">
                  Complaints
                </Text>
                <View className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-red-700 font-bold">{complaintCount}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: "#DC503D" }}
            >
              <Text className="text-white font-bold font-inter">
                Community Board
              </Text>
            </TouchableOpacity>

            <Text className="text-xl font-bold mb-2 font-inter">
              Interruption Alerts
            </Text>
            <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                <Text className="flex-1 text-gray-500 font-medium font-inter">
                  Interruption ID
                </Text>
                <Text className="flex-2 text-gray-500 font-medium font-inter">
                  Alert Description
                </Text>
                <Text className="flex-1 text-gray-500 font-medium text-right font-inter">
                  Severity
                </Text>
              </View>
              {interruptionAlerts.map((alert, index) => (
                <View
                  key={alert.$id}
                  className="flex-row items-center py-2 border-b border-gray-100"
                >
                  <Text className="flex-1 text-gray-700 font-inter">
                    {alert.id}
                  </Text>
                  <Text className="flex-2 text-gray-600 font-inter">
                    {alert.alertdescription.substring(0, 20)}...
                  </Text>
                  <View className="flex-1 items-end ">
                    <View
                      className={`w-3 h-3 rounded-full  ${getSeverityColor(
                        index
                      )} `}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text className="text-xl font-bold mb-2 font-inter">
              Nearest public facilities
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { icon: "cart", name: "SuperMarket", distance: "200m" },
                { icon: "medkit", name: "Hospital", distance: "130m" },
                {
                  icon: "restaurant",
                  name: "Public canteen",
                  distance: "400m",
                },
                { icon: "train", name: "Train station", distance: "500m" },
              ].map((facility, index) => (
                <View key={index} className="w-1/2 p-2">
                  <View className="bg-gray-100 p-4 rounded-lg">
                    <Ionicons
                      name={facility.icon as any}
                      size={24}
                      color="black"
                    />
                    <Text className="font-bold mt-2 font-inter">
                      {facility.name}
                    </Text>
                    <Text>{facility.distance}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;