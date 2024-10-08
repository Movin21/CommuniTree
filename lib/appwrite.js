import { Account, Client,Databases,ID,Query } from "react-native-appwrite";>>>>>>> main

// Appwrite Configuration
const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.communitree",
  projectId: "6700ca24003134750001",
  databaseId: "6700cb3f00092e308fbe",
  userCollectionId: "6700cb5300133bc97557",
  issueCollectionId: "67013a880007ee96ac8d",
  interruptionCollectionId: "67026df100283b696425",
  storageId: "6700cc9a0037b0a68673",
};

// Initialize the Appwrite Client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const database = new Databases(client);

// Initialize the Appwrite Database
export const databases = new Databases(client);
const databaseId = "6700cb3f00092e308fbe"; // Add your database ID
const collectionId = "670373fc003738c26dda"; // Add your collection ID

// Define the maximum reservation limits
const MAX_RESERVATION_COUNTS = {
  Gym: 20,
  Swimming: 20,
  Badminton: 2,
  "Table Tennis": 2,
};

// Function to fetch available time slots and their reservation counts
export async function fetchTimeSlotsForResource(date, resourceType) {
  try {
    // Fetch all documents matching the resource type and date
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("date", date),
      Query.equal("resourceType", resourceType),
    ]);

    // Object to track reservation count for each time slot
    const timeSlotCounts = {};

    // Loop through each document (reservation)
    response.documents.forEach((doc) => {
      const { timeSlot, reservationCount } = doc;

      // If the timeSlot is already present, add the current reservationCount to it
      if (timeSlotCounts[timeSlot]) {
        timeSlotCounts[timeSlot] += reservationCount;
      } else {
        // If not, create the time slot entry and set the initial count
        timeSlotCounts[timeSlot] = reservationCount;
      }
    });

    // Prepare the time slots with status (fully booked or not)
    const timeSlots = Object.keys(timeSlotCounts).map((timeSlot) => ({
      timeSlot,
      count: timeSlotCounts[timeSlot],
      fullyBooked:
        timeSlotCounts[timeSlot] >= MAX_RESERVATION_COUNTS[resourceType],
    }));

    return timeSlots;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
}

// Function to check the current reservation count for a specific time slot
async function checkReservationCount(resourceType, date, timeSlot) {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("resourceType", resourceType),
      Query.equal("date", date),
      Query.equal("timeSlot", timeSlot),
    ]);

    console.log("Fetched documents:", response.documents); // Log the response documents

    // Check if any documents with the same resourceType, date, and timeSlot exist
    if (response.total > 0) {
      const currentReservations = response.documents;
      let totalReservations = 0;

      // Calculate total reservations for the time slot
      currentReservations.forEach((doc) => {
        totalReservations += doc.reservationCount;
      });

      const maxCount = MAX_RESERVATION_COUNTS[resourceType];

      // If total reservations reach the limit, return null to indicate fully booked
      if (totalReservations >= maxCount) {
        return {
          fullyBooked: true,
          totalReservations,
        };
      }

      return {
        fullyBooked: false,
        totalReservations,
      };
    } else {
      // No reservations exist for this time slot yet
      return {
        fullyBooked: false,
        totalReservations: 0,
      };
    }
  } catch (error) {
    console.error("Error checking reservation count:", error.message);
    throw error;
  }
}

// Function to Create or Update a Reservation
export async function createReservation({
  resourceType,
  date,
  timeSlot,
  userDetails,
}) {
  try {
    // Step 1: Check the reservation count for the resource, date, and timeSlot
    const reservationStatus = await checkReservationCount(
      resourceType,
      date,
      timeSlot
    );

    if (reservationStatus.fullyBooked) {
      throw new Error(
        `This time slot is fully booked. Only ${MAX_RESERVATION_COUNTS[resourceType]} reservations allowed.`
      );
    }

    const newReservationData = {
      resourceType,
      date,
      timeSlot,
      fullName: userDetails.userName,
      residenceNumber: userDetails.residenceNumber,
      contactNumber: userDetails.contactNumber,
      email: userDetails.email,
      additionalDetails: userDetails.additionalDetails,
      reservationCount: 1, // Each individual reservation starts with 1 count
    };

    // Step 2: Create a new reservation if not fully booked
    const newReservation = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      newReservationData
    );

    console.log("Reservation created successfully:", newReservation);
    return newReservation;
  } catch (error) {
    console.error("Error creating reservation:", error.message);
    throw error;
  }
}

// Existing account functions (unchanged)
export async function logIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No user account found");
    }
    return currentAccount;
  } catch (error) {
    console.error("Error getting current user:", error.message);
    throw error; // Re-throw the error so we can handle it in the component
  }
}

export async function checkSession() {
  try {
    const session = await account.getSession("current");
    return session;
  } catch (error) {
    console.log("No active session");
    return null;
  }
}

export async function deleteCurrentSession() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

export async function updateUserProfile(updates) {
  try {
    const updatedUser = await account.updateName(updates.name);

    if (updates.email && updates.email !== updatedUser.email) {
      // Note: This will send a verification email to the new address
      await account.updateEmail(updates.email, updates.password);
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function updatePassword(oldPassword, newPassword) {
  try {
    await account.updatePassword(newPassword, oldPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function uploadAvatar(imageUri, userId) {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const file = await storage.createFile("avatars", ID.unique(), blob);
    await account.updatePrefs({ avatar: file.$id });
    return file.$id;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

export async function getAvatarUrl(fileId) {
  try {
    const result = await storage.getFileView("avatars", fileId);
    return result.href;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    return await account.createRecovery(
      email,
      "https://your-app-domain.com/reset-password"
    );
  } catch (error) {
    console.error("Error initiating password recovery:", error);
    throw error;
  }
}

export const fetchInterruptionAlerts = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.interruptionCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(4)]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      id: doc.id,
      alertdescription: doc.alertdescription,
    }));
  } catch (error) {
    console.error("Error fetching interruption alerts:", error);
    throw error;
  }
};

export const fetchComplaints = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.issueCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(10)]
    );

    return response.documents.map(doc => ({
      firstname: doc.firstname,
      issuetitle: doc.issuetitle,
      $id: doc.$id
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const createInterruptionAlert = async (id, alertdescription) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.interruptionCollectionId,
      ID.unique(),
      {
        id: id,
        alertdescription: alertdescription,
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending interruption alert:", error);
    throw error;
  }
};

export const createComplaint = async (formData) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.issueCollectionId,
      ID.unique(),
      formData
    );
    return response;
  } catch (error) {
    console.error("Error submitting issue:", error);
    throw error;
  }
};