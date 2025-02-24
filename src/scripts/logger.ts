interface ILogLevels {
  DEBUG: string;
  INFO: string;
  ERROR: string;
  NONE: string;
}

class Logger {
  public static LOG_LEVELS: ILogLevels = { DEBUG: 'debug', INFO: 'info', ERROR: 'error', NONE: 'none' };
  public static logLevel: string = Logger.LOG_LEVELS.NONE;
  private static colors: any = { default: '#727272', blue: '#5c8fe0', red: '#f44141', exclaim: '#7a42f4' };

  private originator: string;

  constructor(originator: string) {
    this.originator = originator;
  }

  public debug(...args: any[]): void {
    if(Logger.isLogLevel.debug()) {
      console.log(`%c${this.getDateString()}:Debug:${this.originator}:`, `color:${Logger.colors.default};`, ...args);
    }
  }

  public info(...args: any[]): void {
    if(Logger.isLogLevel.info()) {
      console.log(`%c${this.getDateString()}:Info:${this.originator}:`, `color:${Logger.colors.blue};`, ...args);
    }
  }

  public error(...args: any[]): void {
    if(Logger.isLogLevel.error()) {
      console.log(`%c${this.getDateString()}:Error:${this.originator}:`, `color:${Logger.colors.red};`, ...args);
    }
  }

  public exclaim(...args: any[]): void {
    console.log(`%c${this.getDateString()}:IN YOUR FACE:${this.originator}:`, `color:${Logger.colors.exclaim};`, ...args);
  }

  private static isLogLevel: any = {
    debug: () => { return Logger.logLevel === Logger.LOG_LEVELS.DEBUG; },
    info: () => { return Logger.logLevel === Logger.LOG_LEVELS.DEBUG || Logger.logLevel === Logger.LOG_LEVELS.INFO; },
    error: () => { return Logger.logLevel === Logger.LOG_LEVELS.DEBUG || Logger.logLevel === Logger.LOG_LEVELS.ERROR; }
  };

  private getDateString(): string {
    return new Date().toISOString();
  }
}

export default Logger;