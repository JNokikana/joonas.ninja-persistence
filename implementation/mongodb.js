const MongoClient = require('mongodb').MongoClient;
const Persistence = require('../persistence.js');
let Database;
let Client;

async function init(dbName, dbUrl) {
    Client = new MongoClient(dbUrl);
    try {
        await Client.connect();
        return Client.db(dbName);
    } catch (error) {
        console.log(error);
        Client.close();
    }
}

class MongoDB extends Persistence{
    async constructor(dbName, dbUrl) {
        super();
        Database = await init(dbName || process.env.DB_NAME, dbUrl || process.env.DB_URL);
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
            console.log(error);
        }
    }
    cleanUp() {
        if (Client) {
            Client.close();
        }
    }
}

module.exports = MongoDB;