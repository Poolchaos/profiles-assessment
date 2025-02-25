import { customElements } from './components/navbar';
import { Flaapworks, Logger } from './scripts/flaapworks';

(async function () {
  Logger.logLevel = Logger.LOG_LEVELS.DEBUG;
  const logger = new Logger('Index');
  logger.debug('this is a test');
  logger.info('this is a test');
  logger.error('this is a test');

  logger.debug('initialising app');
  await Flaapworks.enableRouter();
  await Flaapworks.initialise();
  Flaapworks.defineCustomElements(customElements);

  logger.exclaim('FLAAP-APP INITALISED');
})();
