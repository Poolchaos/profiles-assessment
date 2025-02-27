import Logger from './logger';
import { Constants } from '../constants/constants';

const logger = new Logger('ActionsService');

export class ActionsService {
  private static listenerMap = new WeakMap<HTMLElement, Map<string, EventListener>>();

  public static async matchActions(action: string, viewModel: any, el: HTMLElement, attr: string, item?: any): Promise<any> {
    try {
      if (!action || typeof action !== 'string') {
        return;
      }
      switch (attr) {
        case Constants.FRAMEWORK.ATTRIBUTES.CLICK:
          ActionsService.addClickCallback(action, viewModel, el, item);
          break;
      }
      return true;
    } catch (e) {
      logger.error('Failed with cause', e);
    }
  }

  private static addClickCallback(action: string, viewModel: any, el: HTMLElement, item?: any): void {
    const match = action.match(/(\w+)\((.*)\)/);
    if (!match) {
      logger.error(`Invalid fl-click action: "${action}"`);
      return;
    }
    const [_, methodName, argExpr] = match;

    const method = viewModel[methodName];
    if (typeof method !== 'function') {
      logger.error(`Method "${methodName}" is not a function on viewModel`);
      return;
    }

    let actionMap = this.listenerMap.get(el);
    if (!actionMap) {
      actionMap = new Map<string, EventListener>();
      this.listenerMap.set(el, actionMap);
    }

    const existingListener = actionMap.get(action);
    if (existingListener) {
      el.removeEventListener('click', existingListener);
    }

    const newListener = (event: Event) => {
      event.stopPropagation();
      logger.debug(`Click triggered for ${methodName} with ${argExpr}`);
      try {
        const argValues = this.evaluateArguments(argExpr, item);
        method.apply(viewModel, argValues);
      } catch (e) {
        logger.error(`Failed to execute "${action}" due to:`, e);
      }
    };

    el.addEventListener('click', newListener);
    actionMap.set(action, newListener);
  }

  private static evaluateArguments(expr: string, item?: any): any[] {
    const parts = expr.split(',').map((part) => part.trim());
    return parts.map((part) => this.evaluateSingleArgument(part, item));
  }

  private static evaluateSingleArgument(part: string, item?: any): any {
    if ((part.startsWith("'") && part.endsWith("'")) || (part.startsWith('"') && part.endsWith('"'))) {
      return part.slice(1, -1);
    }
    if (part === 'true') return true;
    if (part === 'false') return false;
    const num = Number(part);
    if (!isNaN(num)) return num;
    if (item && part.startsWith('item.')) {
      const prop = part.replace('item.', '');
      return item[prop] !== undefined ? item[prop] : part;
    }
    return part;
  }
}
