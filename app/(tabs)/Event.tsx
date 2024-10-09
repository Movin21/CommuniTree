import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EventProps {
  title: string;
  date: string;
  time: string;
  onPress?: () => void;
}

const Event: React.FC<EventProps> = ({ title, date, time, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>Date: {date}</Text>
          <Text style={styles.dateTime}>Time: {time}</Text>
        </View>
      </View>
      <Feather name="arrow-right" size={24} color="black" style={styles.arrow} />
      {/* <Text style={styles.arrow}>→</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C8CEDC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateTimeContainer: {
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    color: '#666',
    marginTop: 50,
  },
});

export default Event;