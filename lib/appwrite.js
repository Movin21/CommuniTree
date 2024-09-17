import { Client } from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://api.appwrite.io/v1",
  platform: "com.sustainsavvy.communiTree",
  projectId: "66e99ced000b5865f901",
  databaseId: "66e9b040000f6c0ab203",
  userCollectionId: "66e9b06f000c033da991",
  storageId: "66e9b2f4002f123af215",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);

// Register User
account.create(ID.unique(), "me@example.com", "password", "Jane Doe").then(
  function (response) {
    console.log(response);
  },
  function (error) {
    console.log(error);
  }
);
