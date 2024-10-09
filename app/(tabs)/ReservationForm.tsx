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
import { router } from "expo-router";

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
type ReservationFormNavigationProp = any;

const ReservationForm = () => {
  const [fullName, setFullName] = useState("");
  const [residenceNumber, setResidenceNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    residenceNumber: "",
    contactNumber: "",
    email: "",
    additionalDetails: "",
  });

  const navigation = useNavigation<ReservationFormNavigationProp>();
  const route = useRoute<ReservationFormRouteProp>();

  const { resourceType, date, timeSlot } = route.params;

  // Validation functions
  const validateFullName = (value: string) => {
    if (value.trim().length < 3) {
      return "Full name must be at least 3 characters long.";
    }
    return "";
  };

  const validateResidenceNumber = (value: string) => {
    const regex = /^RX\d+$/;
    if (!regex.test(value)) {
      return "Residence number must start with RX followed by numbers.";
    }
    return "";
  };

  const validateContactNumber = (value: string) => {
    const regex = /^0\d{9}$/;
    if (!regex.test(value)) {
      return "Contact number must be in the format 0xxxxxxxxx.";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validateAdditionalDetails = (value: string) => {
    if (value.trim() === "") {
      return "Additional details cannot be empty.";
    }
    return "";
  };

  // Input change handlers with real-time validation
  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setErrors({ ...errors, fullName: validateFullName(value) });
  };

  const handleResidenceNumberChange = (value: string) => {
    setResidenceNumber(value);
    setErrors({ ...errors, residenceNumber: validateResidenceNumber(value) });
  };

  const handleContactNumberChange = (value: string) => {
    setContactNumber(value);
    setErrors({ ...errors, contactNumber: validateContactNumber(value) });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handleAdditionalDetailsChange = (value: string) => {
    setAdditionalDetails(value);
    setErrors({
      ...errors,
      additionalDetails: validateAdditionalDetails(value),
    });
  };

  const validateInputs = () => {
    const fullNameError = validateFullName(fullName);
    const residenceNumberError = validateResidenceNumber(residenceNumber);
    const contactNumberError = validateContactNumber(contactNumber);
    const emailError = validateEmail(email);
    const additionalDetailsError = validateAdditionalDetails(additionalDetails);

    setErrors({
      fullName: fullNameError,
      residenceNumber: residenceNumberError,
      contactNumber: contactNumberError,
      email: emailError,
      additionalDetails: additionalDetailsError,
    });

    return (
      !fullNameError &&
      !residenceNumberError &&
      !contactNumberError &&
      !emailError &&
      !additionalDetailsError
    );
  };

  const handleBookPress = () => {
    if (validateInputs()) {
      router.push({
        pathname: "./reviewDetail",
        params: {
          resourceType,
          date,
          timeSlot,
          fullName,
          residenceNumber,
          contactNumber,
          email,
          additionalDetails,
        },
      });
    }
  };

  const handleTermsOfServicePress = () => {
    navigation.navigate("termsOfServices");
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
              onChangeText={handleFullNameChange}
            />
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            ) : null}

            {/* Residence Number Field */}
            <Text style={styles.label}>Residence Number</Text>
            <TextInput
              style={styles.input}
              placeholder="RX#######"
              placeholderTextColor="#C4C4C4"
              value={residenceNumber}
              onChangeText={handleResidenceNumberChange}
            />
            {errors.residenceNumber ? (
              <Text style={styles.errorText}>{errors.residenceNumber}</Text>
            ) : null}

            {/* Contact Number Field */}
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              placeholder="+94xxxxxxxxx"
              placeholderTextColor="#C4C4C4"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={handleContactNumberChange}
            />
            {errors.contactNumber ? (
              <Text style={styles.errorText}>{errors.contactNumber}</Text>
            ) : null}

            {/* Email Field */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="yasas123@example.com"
              placeholderTextColor="#C4C4C4"
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* Additional Details Field */}
            <Text style={styles.label}>Additional Details</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter Your Note Here..."
              placeholderTextColor="#C4C4C4"
              multiline
              value={additionalDetails}
              onChangeText={handleAdditionalDetailsChange}
            />
            {errors.additionalDetails ? (
              <Text style={styles.errorText}>{errors.additionalDetails}</Text>
            ) : null}

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
              style={[styles.nextButton, !isAgreed && styles.disabledButton]}
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
    paddingBottom: 100,
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
    justifyContent: "flex-start",
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
    textDecorationLine: "underline",
    textAlign: "center",
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
    backgroundColor: "#B0B0B0",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
});

export default ReservationForm;
