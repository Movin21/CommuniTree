import { View, Text, ScrollView } from "react-native";
import React from "react";
import ColorList from "../../components/ColorList";

const Home = () => {
  return (
    <ScrollView>
      <ColorList color="#0891b2" />
    </ScrollView>
  );
};

export default Home;
