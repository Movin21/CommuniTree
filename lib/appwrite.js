import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.communitree",
  projectId: "6700ca24003134750001",
  databaseId: "6700cb3f00092e308fbe",
  userCollectionId: "6700cb5300133bc97557",
  storageId: "6700cc9a0037b0a68673",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
