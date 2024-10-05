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
    return currentAccount;
  } catch (error) {
    console.log(error);
    return null;
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
