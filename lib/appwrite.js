import { Account, Client } from "react-native-appwrite";

const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.communitree",
  projectId: "6700ca24003134750001",
  databaseId: "6700cb3f00092e308fbe",
  userCollectionId: "6700cb5300133bc97557",
  issueCollectionId:"67013a880007ee96ac8d",
  interruptionCollectionId:"67026df100283b696425",
  storageId: "6700cc9a0037b0a68673",
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const database = new Databases(client);


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

