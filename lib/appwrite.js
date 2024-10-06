import { Account, Client ,Databases,ID,Query} from "react-native-appwrite";

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

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const database = new Databases(client);

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