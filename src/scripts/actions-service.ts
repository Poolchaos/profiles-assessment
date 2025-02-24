import Logger from './logger';
import { Constants } from '../constants/constants';

const logger = new Logger('ActionsService');

export class ActionsService {
  public static async matchActions(action: any, viewModel: any, el: any, attr: string): Promise<any> {
    try {
      let actionFound = false;
      for (let prop in viewModel) {
        let value = viewModel[prop];
        if (!action && action !== '') {
          return;
        }
        switch (attr) {
          case Constants.FRAMEWORK.ATTRIBUTES.CLICK:
            ActionsService.addClickCallback(action, prop, el, value, attr);
            break;
        }
      }
      return true;
    } catch (e) {
      logger.error('failed with cause', e);
    }
  }

  private static addClickCallback(action: string, prop: string, el: HTMLElement, value: string, attr: string): void {
    ActionsService.tryAddCallbackEvent('click', action, prop, el, value, attr);
  }

  public static async tryAddCallbackEvent(eventType: string, action: string, prop: string, el: HTMLElement, value: any, attr: string): Promise<any> {
    if (action.includes('(') && action.includes(')') && prop === action.replace('()', '')) {
      el.addEventListener(eventType, (event: Event) => {
        try {
          value(event);
        } catch (e) {
          logger.error(`Failed to bind callback to ${action} due to cause:`, e);
        }
      });
      return true;
    }
    return false;
  }
}
