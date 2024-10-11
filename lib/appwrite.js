import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

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
  reservationCollectionId: "670373fc003738c26dda",
  eventsID: "67095de00004a87c42ac",
  acceptsID: "670983b30018855d9daf"
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

export async function createReservation({
  resourceType,
  date,
  timeSlot,
  userDetails,
}) {
  try {
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

    console.log(date);
    // Create a new reservation
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
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );

    return response.documents.map((doc) => ({
      firstname: doc.firstname,
      issuetitle: doc.issuetitle,
      $id: doc.$id,
    }));
  } catch (error) {
    console.error("Error fetching complaints:", error);
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

//added By Movindu
export const isSlotBooked = async (date, timeSlot, resourceType) => {
  try {
    const intDate = parseInt(date, 10);
    console.log("date", intDate);
    const bookings = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      [
        Query.equal("date", intDate),
        Query.equal("timeSlot", timeSlot),
        Query.equal("resourceType", resourceType),
      ]
    );

    console.log(`Number of bookings found: ${bookings.total}`);

    if (resourceType === "Gym" || resourceType === "Swimming Pool") {
      return bookings.total > 0;
    } else {
      return bookings.total > 0; //badminton and others
    }
  } catch (error) {
    console.error("Error checking time slot:", error);
    return true;
  }
};

// Create Event Function
export const createEvent = async (eventData) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsID,
      ID.unique(),
      eventData
    );
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Fetch All Events
export const fetchAllEvents = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsID,
      [Query.orderDesc("$createdAt")]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title,
      date: doc.date,
      time: doc.fromTime
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Fetch Event for a given ID
export const fetchEventById = async (eventId) => {
  try {
    const event  = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsID,
      eventId
    );

    return {
      $id: event.$id,
      title: event.title,
      venue: event.venue,
      contactInformation: event.contactInformation,
      date: event.date,
      fromTime: event.fromTime,
      toTime: event.toTime,
      description: event.description
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// create a function to create an accept
export const createAccept = async (eventId) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      ID.unique(),
      acceptData
    );
    return response;
  } catch (error) {
    console.error("Error creating accept:", error);
    throw error;
  }
};

// Update Accept Count
export const updateAccept = async (eventId) => {
  try {
    // Fetch current event participation data
    const participationData = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      eventId
    );

    // Update the accept count
    const updatedAccepts = participationData.accepts + 1;

    const updatedData = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      eventId,
      { accepts: updatedAccepts }
    );

    return updatedData;
  } catch (error) {
    console.error("Error updating accepts:", error);
    throw error;
  }
};

// Update Reject Count
export const updateReject = async (eventId) => {
  try {
    // Fetch current event participation data
    const participationData = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      eventId
    );

    // Update the reject count
    const updatedRejects = participationData.rejects + 1;

    const updatedData = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      eventId,
      { rejects: updatedRejects }
    );

    return updatedData;
  } catch (error) {
    console.error("Error updating rejects:", error);
    throw error;
  }
};

// Fetch Accepts and Rejects count for an event
export const fetchEventResponses = async (eventId) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.acceptsID,
      [Query.equal("eventId", eventId)]
    );

    // Filter accepted and rejected responses
    const accepted = response.documents.filter(doc => doc.status === 'accepted').length;
    const rejected = response.documents.filter(doc => doc.status === 'rejected').length;

    return { accepted, rejected };
  } catch (error) {
    console.error("Error fetching event responses:", error);
    throw error;
  }
};



