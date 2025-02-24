(async function () {
  Logger.logLevel = Logger.LOG_LEVELS.DEBUG;
  const logger = new Logger('Index');
  logger.debug('this is a test');
  logger.info('this is a test');
  logger.error('this is a test');

  logger.debug('initialising app');
  await Flaapworks.enableRouter();
  await Flaapworks.initialise();
  logger.exclaim('FLAAP-APP INITALISED');
})();
