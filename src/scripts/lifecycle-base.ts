import { Eventing, IMessage } from './event-bus';
import Logger from './logger';
import { makeReactive } from '../utils/reactive';
import { RepeaterService } from './repeater-service';

let logger: Logger;

export class ViewLifecycle {
  private reactiveCallbacks: { [key: string]: () => void } = {};
  private itemVarMap: { [key: string]: string } = {};
  constructor() {
    logger = new Logger(this.constructor.name);
  }

  protected makeArrayReactive<T>(arrayName: string, array: T[], itemVar: string): T[] {
    this.itemVarMap[arrayName] = itemVar;
    const onChange = () => this.updateRepeatableItems(arrayName);
    this.reactiveCallbacks[arrayName] = onChange;
    return makeReactive(array, onChange);
  }

  private updateRepeatableItems(arrayName: string): void {
    const itemVar = this.itemVarMap[arrayName];
    if (!itemVar) {
      logger.error(`No itemVar found for array "${arrayName}"`);
      return;
    }
    RepeaterService.renderRepeatableItems(this, arrayName, itemVar);
  }

  protected activate() {
    logger.debug('Activate has not been implemented. Call super.activate(); to overwrite.');
  }

  protected attached() {
    logger.debug('Attached has not been implemented. Call super.attached(); to overwrite.');
  }

  protected subscribe(eventName: string, callback: (event: IMessage) => void): void {
    Eventing.subscribe(eventName, callback);
  }

  protected deactivate() {
    logger.debug('Deactivate has not been implemented. Call super.deactivate(); to overwrite.');
  }
}
