import { fetchEventById } from '@/lib/appwrite';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface EventData {
    $id: string;
    title: string;
    venue: string;
    contactInformation: string;
    date: string;
    fromTime: string;
    toTime: string;
    description: string;
  }

const EventDetails: React.FC = () => {
    const route = useRoute();
    const { eventId } = route.params as { eventId: string };
    const [event, setEvent] = useState<EventData | null>(null);
    const [acceptCount, setAcceptCount] = useState(0);
    const [rejectCount, setRejectCount] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);

    useEffect(() => {
        const loadEventDetails = async () => {
          try {
            const eventData = await fetchEventById(eventId);
            const formattedEventData: EventData = {
              $id: eventData.$id,
              title: eventData.title,
              venue: eventData.venue,
              contactInformation: eventData.contactInformation,
              date: eventData.date,
              fromTime: eventData.fromTime,
              toTime: eventData.toTime,
              description: eventData.description
            };
            setEvent(formattedEventData);
          } catch (error) {
            console.error('Error fetching event details:', error);
          }
        };
    
        loadEventDetails();
      }, [eventId]);

    const onAccept = () => {
        setAcceptCount(acceptCount + 1);
        setAccepted(true);
    };

    const onReject = () => {
        setRejectCount(rejectCount + 1);
        setRejected(true);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
    
    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!event) {
        return (
          <SafeAreaView style={styles.container}>
            <Text>Loading...</Text>
          </SafeAreaView>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{event.title}</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.infoSection}>
            <InfoItem label="Date" value={formatDate(event.date)} />
            <InfoItem label="Time" value={`${formatTime(event.fromTime)}      -      ${formatTime(event.toTime)}`} />
            <InfoItem label="Venue" value={event.venue} />
            <InfoItem label="Contact Information" value={event.contactInformation} />
            <InfoItem label="Description" value={event.description} />
          </View>
        </View>
      </ScrollView>

        <View style={styles.countContainer}>
          <Text style={styles.countText}>Rejects: {rejectCount}</Text>
          <Text style={styles.countText}>Accepts: {acceptCount}</Text>
        </View>
      <View style={styles.buttonContainer}>
        {!accepted && (
            <>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.rejectButtonText}>REJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                <Text style={styles.acceptButtonText}>ACCEPT</Text>
            </TouchableOpacity>
            </>
        )}
      </View>
    </SafeAreaView>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#C8CEDC',
    borderRadius: 8,
    padding: 25
  },
  infoItem: {
    marginBottom: 25,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 80
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  countText: {
    fontSize: 16,
    marginLeft: 80,
    marginRight: 60,
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 11,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#004BAC',
    borderRadius: 11,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventDetails;