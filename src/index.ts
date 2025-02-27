import { customElements } from './components';
import { Flaapworks } from './scripts/flaapworks';
import Logger from './utils/logger';

import './main.scss';

(async function () {
  Logger.logLevel = Logger.LOG_LEVELS.DEBUG;
  const logger = new Logger('Index');

  logger.debug('initialising app');
  await Flaapworks.enableRouter();
  await Flaapworks.initialise();
  Flaapworks.defineCustomElements(customElements);
  logger.debug('app initialised');
})();
