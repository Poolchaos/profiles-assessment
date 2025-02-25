import { Constants } from '../constants/constants';
import Logger from './logger';

const logger = new Logger('RepeaterService');

export class RepeaterService {
  public static async templateRepeatableItems(viewModel: any): Promise<void> {
    const repeatAttr = Constants.FRAMEWORK.ATTRIBUTES.REPEAT;
    const elements = document.querySelectorAll(`[${repeatAttr}]`);
    for (const el of elements) {
      const repeatValue = el.getAttribute(repeatAttr);
      const [itemVar, arrayName] = this.parseRepeatValue(repeatValue);
      this.renderRepeatableItems(viewModel, arrayName, itemVar, el as HTMLElement);
    }
  }

  public static renderRepeatableItems(viewModel: any, arrayName: string, itemVar: string, templateEl?: HTMLElement): void {
    const itemsArray = viewModel[arrayName];
    if (!Array.isArray(itemsArray)) {
      logger.error(`"${arrayName}" is not an array in viewModel`);
      return;
    }

    const repeatAttr = 'fl-repeat';
    if (!templateEl) {
      templateEl = document.querySelector(`[${repeatAttr}*="${arrayName}"]`) as HTMLElement;
    }
    if (!templateEl) {
      logger.error(`No template found for ${arrayName}`);
      return;
    }

    const parent = templateEl.parentNode;
    const existingItems = parent.querySelectorAll(`[data-repeat="${arrayName}"]`);
    existingItems.forEach((item) => item.remove());
    if (arrayName === 'menuItems') {
      console.log(' ::>> checking array data in viewmodel >>>>> ', { viewModel, arrayData: viewModel[arrayName], arrayName });
    }

    itemsArray.forEach((item) => {
      const clone = templateEl.cloneNode(true) as HTMLElement;
      clone.removeAttribute(repeatAttr);
      clone.setAttribute('data-repeat', arrayName);
      clone.style.display = '';
      this.replacePlaceholders(clone, itemVar, item);
      this.processIfCondition(clone, itemVar, item);
      parent.appendChild(clone);
    });

    templateEl.style.display = 'none';
  }

  private static processIfCondition(el: HTMLElement, itemVar: string, item: any): void {
    const ifAttr = Constants.FRAMEWORK.ATTRIBUTES.IF;
    const elements = el.querySelectorAll(`[${ifAttr}]`) as NodeListOf<HTMLElement>;
    elements.forEach((element) => {
      const condition = element.getAttribute(ifAttr);
      const value = this.evaluateExpression(condition, itemVar, item);
      if (!value) {
        element.remove();
      } else {
        element.removeAttribute(ifAttr);
      }
    });
  }

  private static evaluateExpression(expression: string, itemVar: string, item: any): any {
    if (expression.startsWith(`${itemVar}.`)) {
      const prop = expression.replace(`${itemVar}.`, '');
      return item[prop];
    }
    return item[expression];
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
      const regex = new RegExp(`\\$\\{\\s*${itemVar}\\.(\\w+)\\s*\\}`, 'g');
      node.textContent = node.textContent.replace(regex, (match, prop) => {
        const value = item[prop];
        return value !== undefined ? value : '';
      });
    }

    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (attr.name === 'fl-click') {
        const value = attr.value.replace(new RegExp(`${itemVar}\\.(\\w+)`, 'g'), (match, prop) => {
          const propValue = item[prop];
          return propValue !== undefined ? `${propValue}` : match;
        });
        attr.value = value;
      } else {
        const regex = new RegExp(`\\$\\{\\s*${itemVar}\\.(\\w+)\\s*\\}`, 'g');
        attr.value = attr.value.replace(regex, (match, prop) => {
          const value = item[prop];
          return value !== undefined ? value : '';
        });
      }
    }

    for (let i = 0; i < el.children.length; i++) {
      this.replacePlaceholders(el.children[i] as HTMLElement, itemVar, item);
    }
  }
}
