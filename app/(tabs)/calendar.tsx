import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Event from './Event'; // Import the Event component we just created

const Create: React.FC = () => {
  const events = [
    { title: 'Monthly Clean-Up', date: '8th August', time: '8:00 Onwards' },
    { title: 'BBQ Night Alfred House', date: '25th August', time: '20:00 Onwards' },
    { title: 'Share Plants September', date: '10th September', time: '9:00 Onwards' },
    { title: 'Kids Friday', date: '15th September', time: '8:00 Onwards' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.monthTitle}>August</Text>
        {events.slice(0, 2).map((event, index) => (
          <Event
            key={index}
            title={event.title}
            date={event.date}
            time={event.time}
            onPress={() => console.log(`Pressed ${event.title}`)}
          />
        ))}
        
        <Text style={styles.monthTitle}>September</Text>
        {events.slice(2).map((event, index) => (
          <Event
            key={index}
            title={event.title}
            date={event.date}
            time={event.time}
            onPress={() => console.log(`Pressed ${event.title}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
});

export default Create;
