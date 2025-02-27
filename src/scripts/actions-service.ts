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
        const argValue = this.evaluateArgument(argExpr, item);
        method.call(viewModel, argValue);
      } catch (e) {
        logger.error(`Failed to execute "${action}" due to:`, e);
      }
    };

    el.addEventListener('click', newListener);

    actionMap.set(action, newListener);
  }

  private static evaluateArgument(expr: string, item?: any): any {
    if (!expr.includes('item.')) {
      if ((expr.startsWith("'") && expr.endsWith("'")) || (expr.startsWith('"') && expr.endsWith('"'))) {
        return expr.slice(1, -1);
      }
      return isNaN(Number(expr)) ? expr : Number(expr);
    }

    if (item && expr.startsWith('item.')) {
      const prop = expr.replace('item.', '');
      return item[prop] !== undefined ? item[prop] : expr;
    }

    logger.error(`Unable to evaluate expression: "${expr}" with item:`, item);
    return expr;
  }
}
