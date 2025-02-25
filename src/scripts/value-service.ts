import Logger from './logger';

const logger = new Logger('ValueService');

export class ValueService {
  public static async bindBindableValues(htmlString: string, viewModel: any): Promise<any> {
    for (const prop in viewModel) {
      if (Object.prototype.hasOwnProperty.call(viewModel, prop) && typeof viewModel[prop] !== 'function') {
        const bindableExpressionBraces = new RegExp('\\${' + prop + '}', 'g');
        const bindableExpressionString = new RegExp('"' + prop + '"', 'g');
        if (htmlString.match(bindableExpressionBraces)) {
          htmlString = htmlString.replace(bindableExpressionBraces, viewModel[prop]);
        }
        if (htmlString.match(bindableExpressionString)) {
          htmlString = htmlString.replace(bindableExpressionString, viewModel[prop]);
        }
      }
    }
    return htmlString;
  }

  public static async tryAddValueBinding(action: string, prop: string, el: HTMLElement, value: any, attr: string): Promise<any> {
    try {
      if (action.includes('(') && action.includes(')')) {
        return false;
      }
      if (prop === action) {
        el.setAttribute(attr, value);
        return true;
      }
      return false;
    } catch (e) {
      logger.error('Failed to add value binding for attribute due to', e);
    }
  }
}
