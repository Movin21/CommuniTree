import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation

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
  const navigation = useNavigation();

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

  const handleConfirmPress = () => {
    // You can handle the "Confirm" button press here, like submitting the final data
    console.log("Booking confirmed with details:", {
      resourceType,
      date,
      timeSlot,
      fullName,
      residenceNumber,
      contactNumber,
      email,
      additionalDetails,
    });
    // You can also navigate to another screen after confirmation, if needed
    // navigation.navigate('NextScreen');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Review Booking Details</Text>

      <View style={styles.detailContainer}>
        {/* Display the booking details */}
        <View style={styles.row}>
          <Text style={styles.label}>Resource Type:</Text>
          <Text style={styles.value}>{resourceType}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time Slot:</Text>
          <Text style={styles.value}>{timeSlot}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{fullName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Residence Number:</Text>
          <Text style={styles.value}>{residenceNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{contactNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Additional Details:</Text>
          <Text style={styles.value}>{additionalDetails}</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  detailContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    textAlign: "right",
  },
  confirmButton: {
    backgroundColor: "#004BAC",
    padding: 12,
    width: 150,
    borderRadius: 11,
    marginTop: 30,
    alignItems: "center",
    alignSelf: "center", // Centering the Confirm button horizontally
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ReviewDetail;
