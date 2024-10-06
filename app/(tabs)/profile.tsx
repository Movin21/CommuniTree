import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { 
  getCurrentUser, 
  updateUserProfile, 
  updatePassword, 
  uploadAvatar, 
  getAvatarUrl 
} from "../../lib/appwrite";

// Define types for user data
interface UserData {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    avatar?: string;
  };
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Password reset states
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      if (user) {
        setUserData(user);
        const [first, ...last] = user.name.split(" ");
        setFirstName(first);
        setLastName(last.join(" "));
        setEmail(user.email);
        if (user.prefs?.avatar) {
          const url = await getAvatarUrl(user.prefs.avatar);
          setAvatarUrl(url);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const fullName = `${firstName} ${lastName}`.trim();
      const updates: { name: string; email?: string; password?: string } = {
        name: fullName,
      };

      if (email !== userData?.email) {
        if (!password) {
          Alert.alert(
            "Password Required",
            "Please enter your password to update email"
          );
          return;
        }
        updates.email = email;
        updates.password = password;
      }

      if (userData) {
        const updatedUser = await updateUserProfile(updates);
        setUserData(updatedUser);
        setIsEditing(false);
        setPassword(""); // Clear password field
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!oldPassword || !newPassword) {
        Alert.alert("Error", "Please enter both old and new passwords");
        return;
      }
      await updatePassword(oldPassword, newPassword);
      Alert.alert("Success", "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && userData) {
        setIsLoading(true);
        const fileId = await uploadAvatar(pickerResult.assets[0].uri, userData.$id);
        const url = await getAvatarUrl(fileId);
        setAvatarUrl(url);
        setUserData(prevData => ({
          ...prevData!,
          prefs: { ...prevData!.prefs, avatar: fileId },
        }));
        Alert.alert("Success", "Avatar uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1D4ED8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="items-center mt-6">
          <TouchableOpacity onPress={handleImageUpload}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-purple-200 justify-center items-center">
                <Text className="text-purple-600 font-semibold">Upload</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="mt-4 text-xl font-semibold font-inter">
            {userData?.name || "User Name"}
          </Text>
          <Text className="text-gray-500 font-karla mb-6">
            {userData?.email || "email@example.com"}
          </Text>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-500 font-karla mb-1">First Name</Text>
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={firstName}
              onChangeText={setFirstName}
              editable={isEditing}
              className={isEditing ? "text-black" : "text-gray-500"}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-500 font-karla mb-1">Last Name</Text>
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
              }}
              value={lastName}
              onChangeText={setLastName}
              editable={isEditing}
              className={isEditing ? "text-black" : "text-gray-500"}
            />
          </View>
        </View>

        <Text className="text-gray-500 font-karla mb-1">Email</Text>
        <TextInput
          style={{
            fontFamily: "Karla",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#F3F4F6",
            marginBottom: 16,
          }}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          className={isEditing ? "text-black" : "text-gray-500"}
        />

        {isEditing && email !== userData?.email && (
          <View>
            <Text className="text-gray-500 font-karla mb-1">
              Password (required to update email)
            </Text>
            <TextInput
              style={{
                fontFamily: "Karla",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#F3F4F6",
                marginBottom: 16,
              }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        <TouchableOpacity
          className="bg-blue-800 py-3 rounded-lg items-center mt-2"
          onPress={() => {
            if (isEditing) {
              handleSaveProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text className="text-white font-semibold font-inter">
            {isEditing ? "Save Profile" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            className="bg-gray-500 py-3 rounded-lg items-center mt-2"
            onPress={() => {
              setIsEditing(false);
              setFirstName(userData!.name.split(" ")[0]);
              setLastName(userData!.name.split(" ").slice(1).join(" "));
              setEmail(userData!.email);
              setPassword("");
            }}
          >
            <Text className="text-white font-semibold font-inter">Cancel</Text>
          </TouchableOpacity>
        )}

        <View className="mt-8">
          <Text className="text-gray-400 font-inter text-xs font-semibold tracking-wider mb-4">
            RESET PASSWORD
          </Text>

          <TextInput
            style={{
              fontFamily: "Karla",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#F3F4F6",
              marginBottom: 16,
            }}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Enter old password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          <TextInput
            style={{
              fontFamily: "Karla",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#F3F4F6",
              marginBottom: 16,
            }}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-blue-800 py-3 rounded-lg items-center"
            style={{ width: "40%" }}
            onPress={handleResetPassword}
          >
            <Text className="text-white font-semibold font-inter">Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;