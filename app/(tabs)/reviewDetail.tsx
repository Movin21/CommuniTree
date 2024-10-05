import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

// Define the types for route parameters
type RootStackParamList = {
  reviewDetail: {
    resourceType: string;
    date: string;
    timeSlot: string;
    fullName: string;
    residenceNumber: string;
    contactNumber: string;
    email: string;
    additionalDetails: string;
  };
};

type ReviewDetailRouteProp = RouteProp<RootStackParamList, "reviewDetail">;

const ReviewDetail = () => {
  const route = useRoute<ReviewDetailRouteProp>(); // Get the passed data

  const {
    resourceType,
    date,
    timeSlot,
    fullName,
    residenceNumber,
    contactNumber,
    email,
    additionalDetails,
  } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailContainer}>
        {/* Wrap each dynamic value in a <Text> */}
        <Text style={styles.label}>
          Resource Type: <Text style={styles.value}>{resourceType}</Text>
        </Text>
        <Text style={styles.label}>
          Date: <Text style={styles.value}>{date}</Text>
        </Text>
        <Text style={styles.label}>
          Time Slot: <Text style={styles.value}>{timeSlot}</Text>
        </Text>
        <Text style={styles.label}>
          Full Name: <Text style={styles.value}>{fullName}</Text>
        </Text>
        <Text style={styles.label}>
          Residence Number: <Text style={styles.value}>{residenceNumber}</Text>
        </Text>
        <Text style={styles.label}>
          Contact Number: <Text style={styles.value}>{contactNumber}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          Additional Details:{" "}
          <Text style={styles.value}>{additionalDetails}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  detailContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  value: {
    fontWeight: "normal",
    color: "#555",
  },
});

export default ReviewDetail;
