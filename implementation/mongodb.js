const MongoClient = require('mongodb').MongoClient;
const Persistence = require('../persistence.js').Persistence;
const OnExit = require('../persistence.js').Shutdown;
const ObjectID = require('mongodb').ObjectID;
let Database;
let Client;

function cleanUp() {
    console.log("Shutting down..");
    if (Client) {
        Client.close();
    }
    process.exit(0);
}

class MongoDB extends Persistence {
    async init(dbName, dbUrl, dbUser, dbPassword) {
        let url = `mongodb://${dbUser || process.env.DB_USERNAME}:${dbPassword || process.env.DB_PASSWORD}@${dbUrl || process.env.DB_URL}/?authMechanism=DEFAULT`
        Client = new MongoClient(url);
        try {
            await Client.connect();
            console.log("Connected to mongodb.");
            Database = Client.db(dbName || process.env.DB_NAME);
        } catch (error) {
            console.log(error);
            Client.close();
            throw "Error initializing client.";
        }
    }
    async create(collection, payload) {
        let response;
        try {
            if (Array.isArray(payload)) {
                response = await Database.collection(collection).insertMany(payload);
            }
            else {
                response = await Database.collection(collection).insertOne(payload);
            }
            let id = response.insertedId.toString();
            return id;
        } catch (error) {
            throw error;
        }
    }
    async read(collection, filter) {
        let response;
        try {
            let filterObject = {};
            if (filter) {
                let keys = Object.keys(filter);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === "_id") {
                        if (filter._id instanceof ObjectID) {
                            filterObject._id = filter._id;
                        }
                        else {
                            filterObject._id = new ObjectID(filter._id);
                        }
                    }
                    else if (filter[keys[i]] === "true" ||
                        filter[keys[i]] === "false") {
                        filterObject[keys[i]] = JSON.parse(filter[keys[i]]);

                    }
                    else {
                        filterObject[keys[i]] = filter[keys[i]];
                    }
                }
            }
            response = await Database.collection(collection).find(filterObject).toArray();
            return response;
        } catch (error) {
            throw error;
        }
    }
    async update(collection, original, update) {
        let response;
        try {
            if(original._id && !(original._id instanceof ObjectID)){
                original._id = new ObjectID(original._id);
            }
            response = await Database.collection(collection).updateOne(original, { $set: update });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

OnExit(cleanUp);

module.exports = MongoDB;