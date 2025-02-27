import { Constants } from '../constants/constants';
import { ActionsService } from './actions-service';
import Logger from '../utils/logger';

const logger = new Logger('RepeaterService');

// Extend HTMLElement to include _item
export interface ExtendedHTMLElement extends HTMLElement {
  _item?: any;
}

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
      return;
    }

    const repeatAttr = Constants.FRAMEWORK.ATTRIBUTES.REPEAT;
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

    itemsArray.forEach((item) => {
      const clone = templateEl.cloneNode(true) as ExtendedHTMLElement;
      clone.removeAttribute(repeatAttr);
      clone.setAttribute('data-repeat', arrayName);
      clone.style.display = '';
      clone._item = item;
      this.replacePlaceholders(clone, itemVar, item);
      this.processIfCondition(clone, itemVar, item);

      const clickElements = clone.querySelectorAll('[fl-click]');
      clickElements.forEach((clickEl) => {
        const action = clickEl.getAttribute('fl-click');
        ActionsService.matchActions(action, viewModel, clickEl as HTMLElement, 'fl-click', item);
      });

      parent.appendChild(clone);
    });

    templateEl.style.display = 'none';
  }

  private static processIfCondition(el: ExtendedHTMLElement, itemVar: string, item: any): void {
    const ifAttr = Constants.FRAMEWORK.ATTRIBUTES.IF;
    const elements = el.querySelectorAll(`[${ifAttr}]`) as NodeListOf<ExtendedHTMLElement>;
    elements.forEach((element) => {
      const condition = element.getAttribute(ifAttr);
      if (condition) {
        element.setAttribute('data-if', condition);
        const value = this.evaluateExpression(condition, itemVar, item);
        element.style.display = value ? '' : 'none';
        element.removeAttribute(ifAttr);
      }
    });
  }

  private static evaluateExpression(expression: string, itemVar: string, item: any): any {
    if (expression.startsWith('!')) {
      const subExpression = expression.slice(1).trim();
      const value = this.evaluateExpression(subExpression, itemVar, item);
      return !value;
    } else if (expression.startsWith(`${itemVar}.`)) {
      const prop = expression.replace(`${itemVar}.`, '');
      return item[prop];
    } else {
      return item[expression];
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
      const regex = new RegExp(`\\$\\{\\s*${itemVar}\\.(\\w+)\\s*\\}`, 'g');
      node.textContent = node.textContent.replace(regex, (match, prop) => {
        const value = item[prop];
        return value !== undefined ? value : '';
      });
    }

    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      const regex = new RegExp(`\\$\\{\\s*${itemVar}\\.(\\w+)\\s*\\}`, 'g');

      if (attr.name === Constants.FRAMEWORK.ATTRIBUTES.CLICK) {
        let value = attr.value;
        value = value.replace(new RegExp(`\\$\\{${itemVar}\\.(\\w+)\\}`, 'g'), (match, prop) => {
          const propValue = item[prop];
          return propValue !== undefined ? `${propValue}` : match;
        });
        value = value.replace(new RegExp(`${itemVar}\\.(\\w+)`, 'g'), (match, prop) => {
          const propValue = item[prop];
          return propValue !== undefined ? `${propValue}` : match;
        });
        attr.value = value;
      } else if (attr.name === 'class' || attr.name === 'style' || attr.name.startsWith('data-') || attr.name.startsWith('aria-')) {
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
