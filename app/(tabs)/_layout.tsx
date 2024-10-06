import React from "react";
import { TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import TabBar from "../../components/TabBar"; // Assuming you have a custom TabBar component

const TabsLayout: React.FC = () => {
  const router = useRouter();

  const commonHeaderOptions: BottomTabNavigationOptions = {
    headerStyle: {
      backgroundColor: "white",
    },
    headerTitleStyle: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "800",
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
          title: "Events",
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
  );
};

export default TabsLayout;
