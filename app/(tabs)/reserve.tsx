import React, { useState, useEffect, useRef } from "react";
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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { isSlotBooked } from "@/lib/appwrite";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

type RootStackParamList = {
  ReservationForm: {
    resourceType: string;
    date: string;
    timeSlot: string;
  };
};

type ReservationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReservationForm"
>;

// Simulated function to fetch available time slots for the selected date
const fetchTimeSlotsForDate = async (
  date: string,
  selectedResource: string
): Promise<{ time: string; booked: boolean }[]> => {
  const slots = [
    {
      time: "08:00-09:00",
      booked: await isSlotBooked(date, "08:00-09:00", selectedResource),
    },
    {
      time: "09:00-10:00",
      booked: await isSlotBooked(date, "09:00-10:00", selectedResource),
    },
    {
      time: "10:00-11:00",
      booked: await isSlotBooked(date, "10:00-11:00", selectedResource),
    },
    {
      time: "11:00-12:00",
      booked: await isSlotBooked(date, "11:00-12:00", selectedResource),
    },
    {
      time: "12:00-13:00",
      booked: await isSlotBooked(date, "12:00-13:00", selectedResource),
    },
    {
      time: "13:00-14:00",
      booked: await isSlotBooked(date, "13:00-14:00", selectedResource),
    },
    {
      time: "14:00-15:00",
      booked: await isSlotBooked(date, "14:00-15:00", selectedResource),
    },
    {
      time: "15:00-16:00",
      booked: await isSlotBooked(date, "15:00-16:00", selectedResource),
    },
    {
      time: "16:00-17:00",
      booked: await isSlotBooked(date, "16:00-17:00", selectedResource),
    },
    {
      time: "17:00-18:00",
      booked: await isSlotBooked(date, "17:00-18:00", selectedResource),
    },
    {
      time: "18:00-19:00",
      booked: await isSlotBooked(date, "18:00-19:00", selectedResource),
    },
    {
      time: "19:00-20:00",
      booked: await isSlotBooked(date, "19:00-20:00", selectedResource),
    },
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
  const scrollViewRef = useRef<ScrollView>(null); // For scrolling to the current date
  const navigation = useNavigation<ReservationScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await fetchTimeSlotsForDate(
          String(selectedDate),
          selectedResource || "Gym"
        );
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        Alert.alert("Error", "Failed to fetch time slots. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();

    // Scroll to the selected (current) date after fetching slots
    const scrollTimeout = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: selectedDate * 60 - 100,
        animated: true,
      });
    }, 500);

    return () => clearTimeout(scrollTimeout);
  }, [selectedDate, selectedResource]);

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
    const slots = await fetchTimeSlotsForDate(
      String(date),
      selectedResource || "Gym"
    );
    setTimeSlots(slots);
  };

  // Handle resource selection
  const handleResourceSelect = (resourceName: string) => {
    setSelectedResource(resourceName);
  };

  const handleNext = () => {
    if (selectedResource && selectedTimeSlot && selectedDate !== null) {
      if (selectedDate < today) {
        Alert.alert(
          "Invalid Date",
          "You cannot book a reservation for a past date. Please select a valid date."
        );
        return;
      }
      const formattedDate = `${selectedDate} - ${getDayName(selectedDate)}`; // Format the date
      router.push({
        pathname: "/ReservationForm",
        params: {
          resourceType: selectedResource,
          date: formattedDate,
          timeSlot: selectedTimeSlot,
        },
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
          ref={scrollViewRef}
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../../assets/animations/loading.json")} // Path to your Lottie animation
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
              />
              <Text style={styles.loadingText}>Loading time slots...</Text>
            </View>
          ) : (
            timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTimeSlot(slot.time)}
                style={[
                  styles.timeSlot,
                  selectedDate < today || slot.booked
                    ? styles.bookedSlot
                    : null,
                  selectedTimeSlot === slot.time && styles.selectedTimeSlot,
                ]}
                disabled={selectedDate < today || slot.booked}
              >
                <Text
                  style={[
                    slot.booked ? { color: "#888" } : null,
                    selectedDate < today ? { color: "#888" } : null,
                    selectedTimeSlot === slot.time && styles.selectedTimeText,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))
          )}
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
    marginTop: 20,
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
    fontSize: 11,
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
});

export default ReservationScreen;
