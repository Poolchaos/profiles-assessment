const logger = new Logger('Flaapworks');

const Router = {
  configure: (data) => {},
  navigate: (route) => {},
};

class Flaapworks {
  static router;

  constructor() {
    logger.debug('This is my test log');
  }

  static async initialise() {
    try {
      console.log(' ::>> flaapworks initialised >>>>>> ');
      return Flaapworks;
    } catch (e) {
      logger.error('Failed to load dtlController due to cause:', e);
    }
  }

  static async enableRouter() {
    this.router = Router;
    return Flaapworks;
  }
}
