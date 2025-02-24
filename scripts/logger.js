class Logger {
  static LOG_LEVELS = {
    DEBUG: 'debug',
    INFO: 'info',
    ERROR: 'error',
    NONE: 'none',
  };
  static logLevel = Logger.LOG_LEVELS.NONE;
  static colors = {
    default: '#727272',
    blue: '#5c8fe0',
    red: '#f44141',
    exclaim: '#7a42f4',
  };

  originator;

  constructor(originator) {
    this.originator = originator;
  }

  debug(...args) {
    if (Logger.isLogLevel.debug()) {
      console.log(
        `%c${this.getDateString()}:Debug:${this.originator}:`,
        `color:${Logger.colors.default};`,
        ...args
      );
    }
  }

  info(...args) {
    if (Logger.isLogLevel.info()) {
      console.log(
        `%c${this.getDateString()}:Info:${this.originator}:`,
        `color:${Logger.colors.blue};`,
        ...args
      );
    }
  }

  error(...args) {
    if (Logger.isLogLevel.error()) {
      console.log(
        `%c${this.getDateString()}:Error:${this.originator}:`,
        `color:${Logger.colors.red};`,
        ...args
      );
    }
  }

  exclaim(...args) {
    console.log(
      `%c${this.getDateString()}:IN YOUR FACE:${this.originator}:`,
      `color:${Logger.colors.exclaim};`,
      ...args
    );
  }

  static isLogLevel = {
    debug: () => {
      return Logger.logLevel === Logger.LOG_LEVELS.DEBUG;
    },
    info: () => {
      return (
        Logger.logLevel === Logger.LOG_LEVELS.DEBUG ||
        Logger.logLevel === Logger.LOG_LEVELS.INFO
      );
    },
    error: () => {
      return (
        Logger.logLevel === Logger.LOG_LEVELS.DEBUG ||
        Logger.logLevel === Logger.LOG_LEVELS.ERROR
      );
    },
  };

  getDateString() {
    return new Date().toISOString();
  }
}
