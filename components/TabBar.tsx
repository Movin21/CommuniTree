import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }: any) => {
  const primaryColor = "#004BAC";
  const greyColor = "#7D7F88";
  const screenWidth = Dimensions.get("window").width; // Get the width of the screen

  return (
    <View style={[styles.tabbar, { width: screenWidth }]}>
      {state.routes.map(
        (
          route: { key: string | number; name: string; params: any },
          index: any
        ) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          if (
            [
              "_sitemap",
              "+not-found",
              "adminDashboard",
              "ReservationForm",
              "reviewDetail",
              "notification",
            ].includes(route.name)
          )
            return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              style={styles.tabbar}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? primaryColor : greyColor}
              label={label}
            />
          );
        }
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0, // Pin the tab bar to the bottom of the screen
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    borderTopWidth: 1, // Add a top border if needed
    borderTopColor: "#ccc",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
