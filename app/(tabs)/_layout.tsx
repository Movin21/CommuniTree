import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar";

const _layout = () => {
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

export default _layout;
