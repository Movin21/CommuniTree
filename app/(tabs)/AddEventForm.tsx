import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface AddEventFormProps {
  onSubmit: (eventData: EventData) => void;
  onBack: () => void;
}

interface EventData {
  title: string;
  venue: string;
  contactInformation: string;
  date: Date;
  fromTime: Date;
  toTime: Date;
  description: string;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onSubmit, onBack }) => {
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    venue: '',
    contactInformation: '',
    date: new Date(),
    fromTime: new Date(),
    toTime: new Date(),
    description: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const handleChange = (name: keyof EventData, value: string | Date) => {
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(eventData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add an Event</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={eventData.title}
            onChangeText={(value) => handleChange('title', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Venue"
            value={eventData.venue}
            onChangeText={(value) => handleChange('venue', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Information"
            value={eventData.contactInformation}
            onChangeText={(value) => handleChange('contactInformation', value)}
          />
          
          <TouchableOpacity 
            style={styles.dateInput} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{eventData.date.toDateString()}</Text>
            <Ionicons name="calendar" size={24} color="black" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={eventData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) handleChange('date', selectedDate);
              }}
            />
          )}

          <View style={styles.timeContainer}>
            <TouchableOpacity 
              style={styles.timeInput} 
              onPress={() => setShowFromTimePicker(true)}
            >
              <Text>From: {eventData.fromTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.timeInput} 
              onPress={() => setShowToTimePicker(true)}
            >
              <Text>To: {eventData.toTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>

          {showFromTimePicker && (
            <DateTimePicker
              value={eventData.fromTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowFromTimePicker(false);
                if (selectedTime) handleChange('fromTime', selectedTime);
              }}
            />
          )}

          {showToTimePicker && (
            <DateTimePicker
              value={eventData.toTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowToTimePicker(false);
                if (selectedTime) handleChange('toTime', selectedTime);
              }}
            />
          )}

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={eventData.description}
            onChangeText={(value) => handleChange('description', value)}
          />

          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={24} color="black" />
            <Text style={styles.photoButtonText}>Add Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: "#EDEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#EFEFEF",
    marginBottom: 25,
    color: "#000",
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 25,
    color: "#000",
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    padding: 12,
    marginRight: 2,
    marginLeft: 2
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    padding: 10,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 25,
  },
  photoButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#004BAC",
    padding: 12,
    width: "100%",
    borderRadius: 11,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default AddEventForm;