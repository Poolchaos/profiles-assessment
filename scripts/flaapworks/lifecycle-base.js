import { Eventing, IMessage } from 'fl-event-manager';
import Logger from 'fl-logger';

let logger;

class ViewLifecycle {
  constructor() {
    logger = new Logger(this.constructor.name);
  }

  activate() {
    logger.debug(
      ' Activate has not been implemented. Call super.activate(); to overwrite. '
    );
  }

  attached() {
    logger.debug(
      ' Attached has not been implemented. Call super.attached(); to overwrite. '
    );
  }

  subscribe(eventName, callback) {
    Eventing.subscribe(eventName, callback);
  }

  deactivate() {
    logger.debug(
      ' Deactivate has not been implemented. Call super.deactivate(); to overwrite. '
    );
  }
}
