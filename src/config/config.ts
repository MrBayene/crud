import dotenv from "dotenv";

dotenv.config();

const REPORT_FOLDER = "src/files/todo/";
const DONE_FOLDER = "src/files/done/";
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.6pa1q.mongodb.net/Bauto?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 7000;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
    reportFolder: REPORT_FOLDER,
    doneFolder: DONE_FOLDER,
  },
};
