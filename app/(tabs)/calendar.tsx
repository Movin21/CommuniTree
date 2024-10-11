import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Event from './Event';
import { useNavigation } from '@react-navigation/native';
import { fetchAllEvents } from '@/lib/appwrite';

interface EventData {
  $id: string;
  title: string;
  date: string;
  time: string;
}

const Create: React.FC = () => {
  const navigation = useNavigation<any>();
  const [events, setEvents] = React.useState<EventData[]>([]);
  
  useEffect(() => {
    const getEvents = async () => {
      try {
        const fetchedEvents = await fetchAllEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  const sortedEventsByMonth = useMemo(() => {
    const eventsByMonth: { [key: string]: EventData[] } = {};

    events.forEach(event => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }
      eventsByMonth[monthYear].push(event);
    });

    // Sort events within each month
    Object.keys(eventsByMonth).forEach(month => {
      eventsByMonth[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    // Sort months
    return Object.entries(eventsByMonth).sort(([a], [b]) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const navigateToEventDetails = (eventId: string) => {
    navigation.navigate("EventDetails", { eventId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {sortedEventsByMonth.map(([month, monthEvents]) => (
          <View key={month}>
            <Text style={styles.monthTitle}>{month}</Text>
            {monthEvents.map((event) => (
              <Event
                key={event.$id}
                title={event.title}
                date={event.date}
                time={event.time}
                onPress={() => navigateToEventDetails(event.$id)}
              />
            ))}
          </View>
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
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});

export default Create;