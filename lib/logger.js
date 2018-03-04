var eventEmitter = require('events').EventEmitter,
  processEnv = process.env.NODE_DEBUG,
  util = require('util'),
  loglevel,
  exports,
  logLevels;

exports = module.exports = new eventEmitter();

// `error` events have special meaning in node, and unless a handler is bound,
// they'll raise an exception
exports.on('error', function () {});

// set up default write streams
exports.stdout = process.stdout;
exports.stderr = process.stderr;

// log levels
logLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5
};

// set loglevel based on NODE_DEBUG env variable and create exported methods
function init() {
  var flags = [];

  Object
    .keys(logLevels)
    .forEach(function (type, level) {
      var method = type.toLowerCase();
      exports[method] = log.bind(exports, type, level, false);
      if (new RegExp('\\b' + type + '\\b', 'i').test(processEnv)) {
        flags.push(level);
      }
    });

  loglevel = Math
    .min
    .apply(Math, flags);
}

// format log messages
function formattingLog(type, args) {
  var now = new Date(),
    tmpl = '[%s] %s: %s\n',
    msg;

  msg = args[0]instanceof Error
    ? args[0].stack
    : util
      .format
      .apply(util, args);

  return util.format(tmpl, now, type, msg);
}

function log(type, level) {
  var stream,
    args,
    msg;

  if (level >= loglevel) {
    args = Array
      .prototype
      .slice
      .call(arguments, 3);
    msg = formattingLog(type, args);

    /* checks for the loglevel,
      prints err only if level is more than 3
      prints everything if normal level
    */
    stream = level > 3
      ? 'stderr'
      : 'stdout';
    exports[stream].write(msg);
    exports.emit(type.toLowerCase(), msg);
  }
}

init();