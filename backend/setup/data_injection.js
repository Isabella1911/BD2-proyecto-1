const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;


