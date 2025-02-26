import Logger from './logger';
import { Constants } from '../constants/constants'; // Assuming this holds framework attribute names

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

        if (htmlString.match(bindableExpressionString)) {
          let shouldReplace = true;
          for (const attr of frameworkAttributes) {
            const attrRegex = new RegExp(`${attr}="${prop}"`, 'g');
            if (htmlString.match(attrRegex)) {
              shouldReplace = false;
              break;
            }
          }
          if (shouldReplace) {
            htmlString = htmlString.replace(bindableExpressionString, viewModel[prop]);
          }
        }
      }
    }
    return htmlString;
  }
}
