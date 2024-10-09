import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const { width, height } = Dimensions.get("window");

interface NotificationDetails {
  resource: string;
  date: string;
  time: string;
}

interface Notification {
  id: string;
  type: string;
  details: NotificationDetails;
  receivedTime: string;
  isNew: boolean;
  user: string;
}

const NotificationScreen: React.FC = () => {
  const calculateTimeAgo = (receivedTime: string) => {
    const now = new Date();
    const notificationTime = new Date(receivedTime);
    if (isNaN(notificationTime.getTime())) {
      return "Invalid Date";
    }

    const diffInSeconds = Math.floor(
      (now.getTime() - notificationTime.getTime()) / 1000
    );
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours} hr ago`;
    } else {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      if (diffInDays === 1) {
        return "yesterday";
      }
      return `${diffInDays} days ago`;
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);

  // Fetch notifications from AsyncStorage
  const fetchNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        // Parse and sort notifications by ID (timestamp) in descending order
        const sortedNotifications = JSON.parse(storedNotifications).sort(
          (a: Notification, b: Notification) => parseInt(b.id) - parseInt(a.id)
        );
        setNotifications(sortedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications from local storage:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when the screen mounts
  }, []);

  // Refresh handler for pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(); // Refetch the notifications
    setRefreshing(false); // Stop the refreshing indicator
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.details.resource
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleOpenActionSheet = (notification: Notification) => {
    setSelectedNotification(notification);
    setActionSheetVisible(true);
  };

  const handleToggleReadStatus = async () => {
    if (selectedNotification) {
      const updatedNotifications = notifications.map((notification) => {
        if (notification.id === selectedNotification.id) {
          return { ...notification, isNew: !notification.isNew };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
      setActionSheetVisible(false);

      // Save updated notifications to local storage
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    }
  };

  const handleDeleteNotification = async () => {
    if (selectedNotification) {
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== selectedNotification.id
      );
      setNotifications(updatedNotifications);
      setActionSheetVisible(false);

      // Save updated notifications to local storage
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.notificationCard,
        item.isNew && { backgroundColor: "#EDF3FF" },
      ]}
    >
      {/* Blue dot and Profile Icon Container */}
      <View style={styles.profileContainer}>
        {item.isNew && <View style={styles.blueDot} />}
        <View style={styles.userProfile}>
          <Text style={styles.userInitials}>{item.user}</Text>
        </View>
      </View>

      {/* Notification Text */}
      <View
        style={[
          styles.notificationTextContainer,
          !item.isNew && { marginLeft: 50 },
        ]}
      >
        <Text style={styles.notificationType}>{item.type}</Text>
        {item.details.resource ? (
          <>
            <Text style={styles.notificationDetails}>
              - Resource: {item.details.resource}
            </Text>
            <Text style={styles.notificationDetails}>
              - Date: {item.details.date}
            </Text>
            <Text style={styles.notificationDetails}>
              - Time: {item.details.time}
            </Text>
          </>
        ) : (
          <Text style={styles.notificationDetails}>
            We hope to see you another time.
          </Text>
        )}
      </View>

      {/* Notification Time and More Options */}
      <View style={styles.notificationRight}>
        <Text style={styles.notificationTime}>
          {calculateTimeAgo(item.receivedTime)}
        </Text>
        <TouchableOpacity onPress={() => handleOpenActionSheet(item)}>
          <Text style={styles.moreOptions}>•••</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs Toggle */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "All" && styles.activeTab]}
          onPress={() => setActiveTab("All")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "All" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Unread" && styles.activeTab]}
          onPress={() => setActiveTab("Unread")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Unread" && styles.activeTabText,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Notifications"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Notifications List with pull-to-refresh and infinite scroll */}
      <FlatList
        data={
          activeTab === "Unread"
            ? filteredNotifications.filter((n) => n.isNew)
            : filteredNotifications
        }
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        } // Enable pull-to-refresh
        onEndReached={fetchNotifications} // Fetch more notifications when scrolling up
        onEndReachedThreshold={0.1}
      />

      {/* Action Sheet Modal */}
      <Modal
        transparent={true}
        visible={actionSheetVisible}
        animationType="slide"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActionSheetVisible(false)}
        />
        <View style={styles.actionSheet}>
          <TouchableOpacity
            onPress={handleToggleReadStatus}
            style={styles.actionSheetItem}
          >
            <Text style={styles.actionSheetText}>
              {selectedNotification?.isNew ? "Mark as Read" : "Mark as Unread"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteNotification}
            style={styles.actionSheetItem}
          >
            <Text style={[styles.actionSheetText, styles.deleteText]}>
              Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActionSheetVisible(false)}
            style={[styles.actionSheetItem, styles.cancelButton]}
          >
            <Text style={styles.actionSheetText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    paddingBottom: 10,
    marginRight: 30,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  notificationsList: {
    paddingHorizontal: 0,
    paddingBottom: 100, // Added padding to prevent overflow with navigation bar
  },
  notificationCard: {
    width: width,
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    alignItems: "center",
  },
  profileContainer: {
    position: "absolute",
    left: 13,
    top: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginRight: 5,
  },
  userProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  userInitials: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 65,
  },
  notificationType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  notificationDetails: {
    fontSize: 14,
    color: "#555",
  },
  notificationRight: {
    position: "absolute",
    top: 15,
    right: 10,
    alignItems: "flex-end",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  moreOptions: {
    fontSize: 18,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  actionSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  actionSheetItem: {
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  actionSheetText: {
    fontSize: 16,
    color: "#333",
  },
  deleteText: {
    color: "red",
  },
  cancelButton: {
    borderBottomWidth: 0,
  },
});

export default NotificationScreen;
