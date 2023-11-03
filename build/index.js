import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./passport.js";
import { dbConnect } from "./mongo";
import { meRoutes, authRoutes } from "./routes";
import path from "path";
import * as fs from "fs";
import cron from "node-cron";
import ReseedAction from "./mongo/ReseedAction";
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

const mongoURL = 'mongodb+srv://ParthiGMR:Parthiban7548@parthibangmr.1quwer2.mongodb.net/empmonit'; // Replace with your MongoDB server URL
const dbName = 'empmonit';
const collectionName = 'userinputs';
const collectionNamePm = 'pminputs';

const client = new MongoClient(mongoURL);
const whitelist = [process.env.APP_URL_CLIENT];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

dbConnect();

app.use(cors(corsOptions));
app.use(bodyParser.json({ type: "application/vnd.api+json", strict: false }));

app.get("/", function (req, res) {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/index.html"));
});

app.use("/", authRoutes);
app.use("/me", meRoutes);

if (process.env.SCHEDULE_HOUR) {
  cron.schedule(`0 */${process.env.SCHEDULE_HOUR} * * *`, () => {
    ReseedAction();
  });
}

app.get('/api/mongodb-data', async (req, res) => {
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    client.close();
  }
});
app.get('/api/pminput', async (req, res) => {
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionNamePm);
    const data = await collection.find({}).toArray();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    client.close();
  }
});
app.delete('/api/mongodb-data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Connect to the MongoDB database
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });


    if (result.deletedCount === 1) {
      res.json({ message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error('Error deleting data from MongoDB:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    // Close the MongoDB connection
    client.close();
  }
});

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
