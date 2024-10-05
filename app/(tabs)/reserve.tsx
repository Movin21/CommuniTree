import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // Correct navigation type import
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable"; // Importing Animatable for animations

// Define the ParamList for the stack navigator
type RootStackParamList = {
  ReservationForm: {
    resourceType: string;
    date: string;
    timeSlot: string;
  };
};

// Create a navigation type
type ReservationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReservationForm"
>;

// Simulated function to fetch available time slots for the selected date
const fetchTimeSlotsForDate = async (date: string) => {
  const slots = [
    { time: "08:00-09:00", booked: Math.random() < 0.3 },
    { time: "09:00-10:00", booked: Math.random() < 0.3 },
    { time: "10:00-11:00", booked: Math.random() < 0.3 },
    { time: "11:00-12:00", booked: Math.random() < 0.3 },
    { time: "12:00-13:00", booked: Math.random() < 0.3 },
    { time: "13:00-14:00", booked: Math.random() < 0.3 },
    { time: "14:00-15:00", booked: Math.random() < 0.3 },
    { time: "15:00-16:00", booked: Math.random() < 0.3 },
    { time: "16:00-17:00", booked: Math.random() < 0.3 },
    { time: "17:00-18:00", booked: Math.random() < 0.3 },
    { time: "18:00-19:00", booked: Math.random() < 0.3 },
    { time: "19:00-20:00", booked: Math.random() < 0.3 },
  ];
  return new Promise((resolve) => {
    setTimeout(() => resolve(slots), 1000);
  });
};

// Animations for zooming in and zooming out
const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const ReservationScreen = () => {
  const [selectedResource, setSelectedResource] = useState<string | null>(
    "Gym"
  ); // Default selected resource
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  ); // Default to today's date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<ReservationScreenNavigationProp>();

  const resourceTypes = [
    { id: 1, name: "Gym", image: require("../../assets/images/Gym.png") },
    {
      id: 2,
      name: "Swimming",
      image: require("../../assets/images/Swimming.png"),
    },
    {
      id: 3,
      name: "Badminton",
      image: require("../../assets/images/Badminton.png"),
    },
    {
      id: 4,
      name: "Table Tennis",
      image: require("../../assets/images/TableTennis.png"),
    },
  ];

  useEffect(() => {
    // Fetch available slots for the selected date
    fetchTimeSlotsForDate(String(selectedDate)).then(setTimeSlots);
  }, [selectedDate]);

  const today = new Date().getDate();

  // Function to get the full day name for a specific date
  const getDayName = (day: number) => {
    const date = new Date(2024, 9, day); // October 2024
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()]; // Return full day name
  };

  // Handle selecting a date
  const handleDateSelect = async (date: number) => {
    setSelectedDate(date);
    const slots = await fetchTimeSlotsForDate(String(date));
    setTimeSlots(slots);
  };

  // Handle resource selection
  const handleResourceSelect = (resourceName: string) => {
    setSelectedResource(resourceName);
  };

  const handleNext = () => {
    if (selectedResource && selectedTimeSlot && selectedDate !== null) {
      const formattedDate = `${selectedDate} - ${getDayName(selectedDate)}`; // Format the date
      navigation.navigate("ReservationForm", {
        resourceType: selectedResource,
        date: formattedDate, // Pass the formatted date
        timeSlot: selectedTimeSlot, // Pass the selected time slot
      });
    } else {
      alert("Please select a resource, date, and time slot");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={[
              styles.searchBar,
              isFocused && styles.searchBarFocused, // Change color when focused
            ]}
            placeholder="Search for resource"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <FontAwesome
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
        </View>

        {/* Resource Type Title */}
        <Text style={styles.sectionTitle}>Resource Type</Text>

        {/* Resource Type Selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.resourceContainer}
        >
          {resourceTypes.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              onPress={() => handleResourceSelect(resource?.name || "")}
              style={styles.resourceItem}
            >
              <Animatable.View
                animation={
                  selectedResource === resource.name ? zoomIn : zoomOut
                }
                duration={500}
              >
                <Image source={resource.image} style={styles.resourceImage} />
              </Animatable.View>
              <Text style={styles.resourceText}>{resource.name}</Text>
              {selectedResource === resource.name && (
                <View style={styles.activeLine} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Separator Line */}
        <View style={styles.separatorLine} />

        {/* Time Slot Picker */}
        <Text style={styles.sectionTitle}>Select Date and Time</Text>

        {/* Date Picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.datePicker}
        >
          {[...Array(31).keys()].map((_, i) => {
            const day = i + 1;
            return (
              <View key={day} style={styles.dateItem}>
                <Text style={styles.dayName}>{getDayName(day)}</Text>
                <TouchableOpacity
                  onPress={() => handleDateSelect(day)}
                  style={[
                    styles.dateCircle,
                    selectedDate === day && styles.selectedDateCircle,
                    today === day &&
                      selectedDate !== day &&
                      styles.todayDateCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === day && styles.activeDateText,
                      today === day &&
                        selectedDate !== day &&
                        styles.todayDateText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Time Slots */}
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => !slot.booked && setSelectedTimeSlot(slot.time)}
              style={[
                styles.timeSlot,
                slot.booked ? styles.bookedSlot : null,
                selectedTimeSlot === slot.time && styles.selectedTimeSlot,
              ]}
              disabled={slot.booked} // Disable booked slots
            >
              <Text
                style={[
                  slot.booked ? { color: "#888" } : null,
                  selectedTimeSlot === slot.time && styles.selectedTimeText,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Updated background color
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  searchWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  searchBar: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f7f7f7",
    paddingRight: 50,
  },
  searchBarFocused: {
    borderColor: "#004BAC", // Change border color on focus
  },
  searchIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  resourceContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 20,
  },
  resourceItem: {
    alignItems: "center", // Ensure everything inside is centered
    marginRight: 18,
    width: 120, // Adjust the width of the card
    borderRadius: 20,
    marginLeft: 15,
  },
  resourceImageWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#EBEBEB",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resourceImage: {
    width: 120,
    height: 120,
    backgroundColor: "#EBEBEB",
    borderRadius: 20,
  },
  resourceText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center", // Ensure text is centered
    fontWeight: "bold",
    marginTop: 15,
  },
  activeLine: {
    height: 4,
    backgroundColor: "#004BAC",
    borderRadius: 40,
    marginTop: 10,
    width: "80%",
    alignSelf: "center", // Center the active line
  },
  selectedResource: {
    borderColor: "#004BAC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  separatorLine: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
    marginBottom: 20,
  },
  datePicker: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dateItem: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  dateCircle: {
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  selectedDateCircle: {
    backgroundColor: "#004BAC",
  },
  todayDateCircle: {
    backgroundColor: "#d3d3d3",
  },
  dayName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  activeDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todayDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeSlot: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },
  bookedSlot: {
    backgroundColor: "#ddd",
  },
  selectedTimeSlot: {
    backgroundColor: "#004BAC",
  },
  selectedTimeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#004BAC",
    padding: 12,
    width: 150,
    borderRadius: 11,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center", // Centering the Next button horizontally
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ReservationScreen;
