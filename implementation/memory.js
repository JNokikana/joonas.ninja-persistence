const LokiJS = require('lokijs');
const Persistence = require('../persistence.js').Persistence;
const OnExit = require('../persistence.js').Shutdown;
const ObjectID = require('mongodb').ObjectID;
let Database;

function cleanUp() {
    console.log("Shutting down..");
    process.exit(0);
}

function findCollectionIfItExists(name) {
    for (var i = 0; i < Database.collections.length; i++) {
        if (Database.collections[i].name === name) {
            return Database.collections[i];
        }
    }
    return null;
}

class Memory extends Persistence {
    async init(dbName) {
        try {
            console.log("Initialized memory database.");
            Database = new LokiJS(dbName);
        } catch (error) {
            console.log(error);
            throw "Error initializing client.";
        }
    }
    async create(collection, payload) {
        let response;
        let collectionObject;
        try {
            collectionObject = findCollectionIfItExists(collection);
            if (!collectionObject) {
                collectionObject = await Database.addCollection(collection);
            }
            response = await collectionObject.insert(payload);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async read(collection, filter) {
        let response;
        try {
            let filterObject = {};
            let collectionObject
            /*
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
            */
           collectionObject = findCollectionIfItExists(collection);
            if (collectionObject) {
                response = await collectionObject.find(filterObject);
                return response;
            }
            else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    }
    async update(collection, original, update) {
        let response;
        try {
            if (original._id && !(original._id instanceof ObjectID)) {
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

module.exports = Memory;