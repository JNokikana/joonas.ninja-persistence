const MongoDB = require('./implementation/mongodb.js');
const Memory = require('./implementation/memory.js');
let Persistence;

if (process.env.PERSISTENCE_PROVIDER === "mongodb") {
    Persistence = require('./implementation/mongodb.js');
}
else if (process.env.PERSISTENCE_PROVIDER === "memory") {
    Persistence = require('./implementation/memory.js');
}
module.exports = {
    MongoDB,
    Memory,
    Persistence
}