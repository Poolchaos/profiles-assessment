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

    const itemsArray = viewModel[arrayName];
    if (!Array.isArray(itemsArray)) {
      logger.error(`"${arrayName}" is not an array in viewModel`);
      return;
    }

    itemsArray.forEach((item) => {
      const clone = templateEl.cloneNode(true) as HTMLElement;
      clone.removeAttribute(repeatAttr);
      clone.setAttribute('data-repeat', arrayName);
      clone.style.display = '';
      this.replacePlaceholders(clone, itemVar, item);
      parent.appendChild(clone);
    });

    templateEl.style.display = 'none';
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

    const regex = new RegExp(`\\$\\{\\s*${itemVar}\\.(\\w+)\\s*\\}`, 'g');
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attr.value = attr.value.replace(regex, (match, prop) => {
        const value = item[prop];
        return value !== undefined ? value : '';
      });
    }

    for (let i = 0; i < el.children.length; i++) {
      this.replacePlaceholders(el.children[i] as HTMLElement, itemVar, item);
    }
  }
}
