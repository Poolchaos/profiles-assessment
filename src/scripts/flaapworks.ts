import Logger from '../utils/logger';
import { ViewLifecycle } from './lifecycle-base';
import { ModuleLoader } from './module-loader';
import { Router } from './router';
import { CustomComponent, CustomElementConfig } from './custom-element';

Logger.logLevel = Logger.LOG_LEVELS.DEBUG;
const logger = new Logger('Flaapworks');

class Flaapworks {
  public static router: Router;

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
    this.router = new Router();
    return Flaapworks;
  }

  public static defineCustomElements(configs: CustomElementConfig[]): void {
    configs.forEach((config) => {
      try {
        new CustomComponent(config);
      } catch (error) {
        logger.error(`Failed to define custom element '${config.tagName}':`, error);
      }
    });
  }
}
export { Flaapworks, ViewLifecycle, Logger, Router, CustomElementConfig };
