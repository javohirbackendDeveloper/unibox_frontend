import { Client, Account, ID } from "appwrite";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("qbetrwyjrtyteuryk");

const account = new Account(client);

export { account, ID, client };
