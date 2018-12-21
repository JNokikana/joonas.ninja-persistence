const MongoClient = require('mongodb').MongoClient;
const Persistence = require('../persistence.js').Persistence;
const OnExit = require('../persistence.js').Shutdown;
const ObjectID = require('mongodb').ObjectID;
let Database;
let Client;

async function init(dbName, dbUrl, dbUser, dbPassword) {
    let url = `mongodb://${dbUser}:${dbPassword}@${dbUrl}/?authMechanism=DEFAULT`
    Client = new MongoClient(url);
    try {
        await Client.connect();
        console.log("Connected to mongodb.");
        return Client.db(dbName);
    } catch (error) {
        console.log(error);
        Client.close();
        throw "Error initializing client.";
    }
}

function cleanUp() {
    console.log("Shutting down..");
    if (Client) {
        Client.close();
    }
    process.exit(0);
}

class MongoDB extends Persistence {
    constructor(dbName, dbUrl, dbUser, dbPassword) {
        super();
        init(dbName || process.env.DB_NAME,
            dbUrl || process.env.DB_URL,
            dbUser || process.env.DB_USERNAME,
            dbPassword || process.env.DB_PASSWORD)
            .then((database) => {
                Database = database;
            }, (error) => {
                console.log(error);
            });
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
            return response;
        } catch (error) {
            throw error;
        }
    }
    async read(collection, filter) {
        let response;
        try {
            let filterObject = {};
            if (filter && filter._id) {
                if(filter._id instanceof ObjectID){
                    filterObject._id = filter._id;
                }
                else{
                    filterObject._id = new ObjectID(filter._id);
                }
            }
            response = await Database.collection(collection).find(filterObject).toArray();
            return response;
        } catch (error) {
            throw error;
        }
    }
    async update(collection, payload) {
        let response;
        try {
            response = await Database.collection(collection).findOneAndUpdate(payload);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

OnExit(cleanUp);

module.exports = MongoDB;