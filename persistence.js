const Shutdown = require('death');

class Persistence {
    /**
     * Implement this in a subclass.
     */
    cleanUp() { 
        console.log("Should not be here.");
    }
    create() { }
    read() { }
    update() { }
    delete() { }
}

Shutdown(Persistence.cleanUp);

module.exports = Persistence;