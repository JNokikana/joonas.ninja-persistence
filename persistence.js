const Shutdown = require('death');

class Persistence {
    /**
     * Implement this in a subclass.
     */
    cleanUp();
}

Shutdown(Persistence.cleanUp);

module.exports = Persistence;