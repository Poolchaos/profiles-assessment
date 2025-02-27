import Logger from './logger';
import { Constants } from '../constants/constants';

const logger = new Logger('ValueService');

export class ValueService {
  public static async bindBindableValues(htmlString: string, viewModel: any): Promise<any> {
    const frameworkAttributes = [Constants.FRAMEWORK.ATTRIBUTES.IF, Constants.FRAMEWORK.ATTRIBUTES.REPEAT, Constants.FRAMEWORK.ATTRIBUTES.CLICK];

    for (const prop in viewModel) {
      if (Object.prototype.hasOwnProperty.call(viewModel, prop) && typeof viewModel[prop] !== 'function') {
        const bindableExpressionBraces = new RegExp('\\${' + prop + '}', 'g');
        const bindableExpressionString = new RegExp('"' + prop + '"', 'g');

        if (htmlString.match(bindableExpressionBraces)) {
          htmlString = htmlString.replace(bindableExpressionBraces, viewModel[prop]);
        }

        const placeholderRegex = /\${([^}]+)}/g;
        let match;
        while ((match = placeholderRegex.exec(htmlString)) !== null) {
          const expression = match[1];
          const bindableExpressionString = new RegExp(`\\${match[0]}`, 'g');
          let shouldReplace = true;
          for (const attr of frameworkAttributes) {
            const attrRegex = new RegExp(`${attr}="${expression}"`, 'g');
            if (htmlString.match(attrRegex)) {
              shouldReplace = false;
              break;
            }
          }
          if (shouldReplace) {
            const value = ValueService.evaluateExpression(expression, viewModel);
            htmlString = htmlString.replace(bindableExpressionString, value !== undefined ? value : match[0]);
          }
        }
      }
    }
    return htmlString;
  }
  public static evaluateExpression(expression: string, viewModel: any): any {
    try {
      return expression.split('.').reduce((obj, key) => obj?.[key], viewModel);
    } catch (e) {
      return undefined;
    }
  }
}
