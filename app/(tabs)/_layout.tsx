import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar"; // Assuming you have a custom TabBar component

const TabsLayout = () => {

import { Tabs, useRouter } from "expo-router";
import TabBar from "../../components/TabBar";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

const _layout: React.FC = () => {
  const router = useRouter();
  const commonHeaderOptions: BottomTabNavigationOptions = {
    headerStyle: {
      backgroundColor: "white",
    },
    headerTitleStyle: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    headerTitleAlign: "center",
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginLeft: 16 }}
      >
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => router.push("#")}
        style={{ marginRight: 16 }}
      >
        <Feather name="bell" size={24} color="#0066FF" />
      </TouchableOpacity>
    ),
    headerShadowVisible: false,
  };
  return (
    <>
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            ...commonHeaderOptions,
          }}
        />
        <Tabs.Screen
          name="reserve"
          options={{
            title: "Reservations",
            ...commonHeaderOptions,
          }}
        />
        <Tabs.Screen
          name="complaints"
          options={{
            title: "Complaints",
            ...commonHeaderOptions,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            ...commonHeaderOptions,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            ...commonHeaderOptions,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
