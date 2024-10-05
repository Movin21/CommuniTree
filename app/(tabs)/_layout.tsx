import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar"; // Assuming you have a custom TabBar component

const TabsLayout = () => {
  return (
    <>
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="reserve"
          options={{
            title: "Reservations",
          }}
        />
        <Tabs.Screen
          name="complaints"
          options={{
            title: "Complaints",
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
