const Shutdown = require('death');

class Persistence {
    /**
     * Implement this in a subclass.
     */
    cleanUp() { }
    create() { }
    read() { }
    update() { }
    delete() { }
}

Shutdown(Persistence.cleanUp);

module.exports = Persistence;