import { Constants } from '../constants/constants';
import Logger from './logger';

const logger = new Logger('RepeaterService');

export class RepeaterService {
  public static async templateRepeatableItems(viewModel: any): Promise<any> {
    const repeatAttr = Constants.FRAMEWORK.ATTRIBUTES.REPEAT;
    const elements = document.querySelectorAll(`[${repeatAttr}]`);
    if (!elements.length) return true;

    try {
      for (const el of elements) {
        const repeatValue = el.getAttribute(repeatAttr);
        const [itemVar, arrayName] = this.parseRepeatValue(repeatValue);
        const itemsArray = viewModel[arrayName];

        if (!itemsArray || !Array.isArray(itemsArray)) {
          logger.error(`Array "${arrayName}" not found or not an array in viewModel`);
          continue;
        }

        const parent = el.parentNode;
        itemsArray.forEach((item: any) => {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.removeAttribute(repeatAttr);
          this.replacePlaceholders(clone, itemVar, item);
          this.bindEvents(clone, viewModel, itemVar, item);
          parent.insertBefore(clone, el);
        });
        el.remove();
      }
      return true;
    } catch (e) {
      logger.error('Failed to render repeaters due to cause:', e);
      return false;
    }
  }

  private static parseRepeatValue(value: string): [string, string] {
    const parts = value.split(' of ');
    if (parts.length !== 2) {
      throw new Error(`Invalid fl-repeat syntax: "${value}". Use "variable of arrayName"`);
    }
    return [parts[0].trim(), parts[1].trim()];
  }

  private static replacePlaceholders(el: HTMLElement, itemVar: string, item: any): void {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      node.textContent = node.textContent.replace(new RegExp(`\\$\\{${itemVar}\\.(\\w+)\\}`, 'g'), (match, prop) => item[prop] || '');
    }
  }

  private static bindEvents(el: HTMLElement, viewModel: any, itemVar: string, item: any): void {
    const clickAttr = Constants.FRAMEWORK.ATTRIBUTES.CLICK;
    if (el.hasAttribute(clickAttr)) {
      const action = el.getAttribute(clickAttr);
      const [funcName, argPart] = action.split('(');
      const arg = argPart.replace(')', '').trim();
      const prop = arg.replace(`${itemVar}.`, '');
      el.addEventListener('click', () => {
        if (typeof viewModel[funcName] === 'function') {
          viewModel[funcName](item[prop]);
        } else {
          logger.error(`Function "${funcName}" not found in viewModel`);
        }
      });
      el.removeAttribute(clickAttr);
    }
  }
}
