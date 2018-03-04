var customLogger = require('./index.js');

// log level is info
customLogger.info('this is a %s with some %s', 'info', 'formatting');

// log level is critical
customLogger.critical('this is a %s with some %s', 'critical', 'formatting');

// log level is trace
customLogger.trace('this is a %s with some %s', 'trace', 'formatting');