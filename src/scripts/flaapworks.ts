import Logger from './logger';
import { ViewLifecycle } from './lifecycle-base';
import { ModuleLoader } from './module-loader';

Logger.logLevel = Logger.LOG_LEVELS.DEBUG;
const logger = new Logger('Flaapworks');

const Router = {
  configure: (data: any[]) => {},
  navigate: (route: string) => {},
};

class Flaapworks {
  public static router: typeof Router;

  constructor() {
    logger.debug('This is my test log');
  }

  public static async initialise(): Promise<any> {
    try {
      await ModuleLoader.initialise();
      return Flaapworks;
    } catch (e) {
      logger.error('Failed to load dtlController due to cause:', e);
    }
  }

  public static async enableRouter(): Promise<any> {
    this.router = Router;
    return Flaapworks;
  }
}
export { Flaapworks, ViewLifecycle, Logger };
