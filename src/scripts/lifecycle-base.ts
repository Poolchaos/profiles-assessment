import { Eventing, IMessage } from './event-bus';
import Logger from './logger';

let logger: Logger;

export class ViewLifecycle {
  constructor() {
    logger = new Logger(this.constructor.name);
  }

  protected activate() {
    logger.debug(' Activate has not been implemented. Call super.activate(); to overwrite. ');
  }

  protected attached() {
    logger.debug(' Attached has not been implemented. Call super.attached(); to overwrite. ');
  }

  protected subscribe(eventName: string, callback: (event: IMessage) => void): void {
    Eventing.subscribe(eventName, callback);
  }

  protected deactivate() {
    logger.debug(' Deactivate has not been implemented. Call super.deactivate(); to overwrite. ');
  }
}
