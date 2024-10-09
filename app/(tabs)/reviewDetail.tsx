import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // For icons
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createReservation } from "../../lib/appwrite"; // Import the createReservation function
import { useRouter } from "expo-router";

// Define the types for route parameters
type RootStackParamList = {
  reviewDetail: {
    resourceType: string;
    date: string; // Format like '8 - Tuesday'
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
  const [showCancelModal, setShowCancelModal] = useState(false); // Manage modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success Modal visibility
  const route = useRoute<ReviewDetailRouteProp>(); // Get the passed data
  const navigation = useNavigation();
  const router = useRouter();

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
    // Show the confirm booking modal
    setShowCancelModal(true);
  };

  const handleYesPress = async () => {
    try {
      // Extract the first part of the date string (e.g., "8 - Tuesday" => 8)
      const extractedDate = parseInt(date.split(" ")[0], 10);

      console.log("Extracted date:", extractedDate);

      const reservationData = {
        resourceType,
        date: extractedDate, // Pass the extracted date as an integer
        timeSlot,
        userDetails: {
          userName: fullName,
          residenceNumber,
          contactNumber,
          email,
          additionalDetails,
        },
      };

      // Call the createReservation function to store the data
      const response = await createReservation(reservationData);

      if (response) {
        await addNotification(); // Call the function to add the notification
        console.log("Notification successfully passed to local storage");
        setShowCancelModal(false); // Close the cancel modal
        setShowSuccessModal(true); // Show the success modal
      }
    } catch (error: any) {
      console.error("Error saving reservation:", error);
    }
  };

  const handleNoPress = () => {
    setShowCancelModal(false); // Close the modal
  };

  const addNotification = async () => {
    try {
      const newNotification = {
        id: Date.now().toString(), // Use timestamp as unique id
        type: "Your booking is confirmed!",
        details: {
          resource: `[${resourceType}]`,
          date: `[${date}]`,
          time: `[${timeSlot}]`,
        },
        receivedTime: new Date().toISOString(), // Set to the current time in ISO format
        isNew: true, // Mark as new
        user: "AD", // Set user as "AD"
      };

      const storedNotifications = await AsyncStorage.getItem("notifications");
      const notificationsArray = storedNotifications
        ? JSON.parse(storedNotifications)
        : [];

      notificationsArray.push(newNotification);

      // Log notification data before saving it
      console.log("Saving notification:", newNotification);

      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notificationsArray)
      );

      // Log all notifications after saving
      console.log("All notifications:", notificationsArray);
    } catch (error) {
      console.error("Error adding notification:", error);
    }
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
        onPress={handleConfirmPress} // Trigger modal on press
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              width: "80%",
            }}
          >
            {/* Question Mark Icon */}
            <View
              style={{
                backgroundColor: "#FEBE01",
                borderRadius: 40,
                padding: 10,
                marginBottom: 20,
              }}
            >
              <Feather name="help-circle" size={40} color="white" />
            </View>

            <Text
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Confirm Booking?
            </Text>

            <Text
              style={{
                fontFamily: "Karla",
                fontSize: 16,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Are you sure you want to confirm this booking?
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {/* No Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#AC0000",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={handleNoPress}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>

              {/* Yes Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#004BAC",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
                onPress={handleYesPress}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              width: "80%",
            }}
          >
            <View
              style={{
                backgroundColor: "#004BAC",
                borderRadius: 40,
                padding: 10,
                marginBottom: 20,
              }}
            >
              {/* Success Checkmark Icon */}
              <Feather name="check-circle" size={40} color="white" />
            </View>
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Success
            </Text>
            <Text
              style={{
                fontFamily: "Karla",
                fontSize: 16,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Your booking was successful!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#004BAC",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("./home"); // Navigate back to home or another screen
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter",
                  fontWeight: "bold",
                }}
              >
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
