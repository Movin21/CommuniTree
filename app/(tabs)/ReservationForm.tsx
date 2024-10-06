import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Define the types for route parameters
type RootStackParamList = {
  ReservationForm: {
    resourceType: string;
    date: string;
    timeSlot: string;
  };
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

type ReservationFormRouteProp = RouteProp<
  RootStackParamList,
  "ReservationForm"
>;

// Define the type for navigation
type ReservationFormNavigationProp = any; // Use `any` if you're unsure of the full navigation structure, or replace with a proper type if needed

const ReservationForm = () => {
  const [fullName, setFullName] = useState("");
  const [residenceNumber, setResidenceNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  // Fix typing for navigation and route
  const navigation = useNavigation<ReservationFormNavigationProp>();
  const route = useRoute<ReservationFormRouteProp>(); // Get the data passed from the previous screen

  // Get the passed details from route.params
  const { resourceType, date, timeSlot } = route.params;

  const validateInputs = () => {
    // Check if any of the required fields are empty
    if (
      !fullName ||
      !residenceNumber ||
      !contactNumber ||
      !email ||
      !additionalDetails
    ) {
      Alert.alert("Validation Error", "Please fill out all the fields.");
      return false;
    }
    // Check if the user has agreed to the terms
    if (!isAgreed) {
      Alert.alert(
        "Terms of Service",
        "You must agree to the Terms of Service to proceed."
      );
      return false;
    }
    return true;
  };

  const handleBookPress = () => {
    // Validate input fields
    if (validateInputs()) {
      // Log all details in the console before navigation
      console.log({
        resourceType,
        date,
        timeSlot, // Ensure this is logged
        fullName,
        residenceNumber,
        contactNumber,
        email,
        additionalDetails,
      });

      // Navigate to the reviewDetail screen and pass all the form and previous screen data
      navigation.navigate("reviewDetail", {
        resourceType,
        date,
        timeSlot, // Pass the time slot to the next screen
        fullName,
        residenceNumber,
        contactNumber,
        email,
        additionalDetails,
      });
    }
  };

  const handleTermsOfServicePress = () => {
    navigation.navigate("termsOfServices"); // Navigate to the termsOfServices screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            {/* Full Name Field */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Yasas Lakmina"
              placeholderTextColor="#C4C4C4"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Residence Number Field */}
            <Text style={styles.label}>Residence Number</Text>
            <TextInput
              style={styles.input}
              placeholder="RX#######"
              placeholderTextColor="#C4C4C4"
              value={residenceNumber}
              onChangeText={setResidenceNumber}
            />

            {/* Contact Number Field */}
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              placeholder="+94xxxxxxxxx"
              placeholderTextColor="#C4C4C4"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />

            {/* Email Field */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="yasas123@example.com"
              placeholderTextColor="#C4C4C4"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {/* Additional Details Field */}
            <Text style={styles.label}>Additional Details</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter Your Note Here..."
              placeholderTextColor="#C4C4C4"
              multiline
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
            />

            {/* Terms and Conditions */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
                <View style={styles.checkbox}>
                  {isAgreed && <View style={styles.checkedBox} />}
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.termsText}>
                  By Submitting, I agree to communitree
                </Text>
                <Text
                  style={styles.linkText}
                  onPress={handleTermsOfServicePress}
                >
                  Terms of Services
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.nextButton, !isAgreed && styles.disabledButton]} // Grays out if checkbox is unchecked
              onPress={handleBookPress}
            >
              <Text style={styles.nextButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollViewContainer: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 100, // Ensures space for the button to not overlap
  },
  form: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    height: 50,
    borderColor: "#EDEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#EFEFEF",
    marginBottom: 15,
    color: "#000",
  },
  textArea: {
    height: 100,
    borderColor: "#EDEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: "#EFEFEF",
    marginBottom: 15,
    textAlignVertical: "top",
    color: "#000",
  },
  checkboxContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginBottom: 20,
    justifyContent: "flex-start", // Ensure checkbox is left-aligned
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  checkedBox: {
    width: 11,
    height: 11,
    backgroundColor: "#004BAC",
  },
  termsText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  linkText: {
    color: "#004BAC",
    textDecorationLine: "underline", // Underline the text
    textAlign: "center", // Centering the Terms of Services text
  },
  nextButton: {
    backgroundColor: "#004BAC",
    padding: 12,
    width: 150,
    borderRadius: 11,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#B0B0B0", // Gray color for disabled state
  },
});

export default ReservationForm;
