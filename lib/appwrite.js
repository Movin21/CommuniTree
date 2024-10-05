import { Account, Client } from "react-native-appwrite";

const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.communitree",
  projectId: "6700ca24003134750001",
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);

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
