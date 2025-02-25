import Logger from './logger';
import { Constants } from '../constants/constants';

const logger = new Logger('ActionsService');

export class ActionsService {
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
      logger.error('failed with cause', e);
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
      return;
    }

    el.addEventListener('click', () => {
      try {
        const argValue = this.evaluateExpression(argExpr, item);
        method(argValue);
      } catch (e) {
        logger.error(`Failed to execute "${action}" due to:`, e);
      }
    });
  }

  private static evaluateExpression(expr: string, item: any): any {
    if (!item) {
      return expr;
    }

    if (expr.startsWith('item.')) {
      expr = expr.substring(5);
    }

    const parts = expr.split('.');
    let value = item;
    for (const part of parts) {
      value = value[part];
      if (value === undefined) {
        logger.error(`Invalid expression: "${expr}" for item:`, item);
        return '';
      }
    }
    return value;
  }
}
