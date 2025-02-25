import { Constants } from '../constants/constants';
import Logger from './logger';
import { ActionsService } from './actions-service';

const logger = new Logger('RepeaterService');

export class RepeaterService {
  public static async templateRepeatableItems(viewModel: any): Promise<any> {
    const attr = Constants.FRAMEWORK.ATTRIBUTES.REPEAT;
    const el: HTMLElement = document.querySelector(`[${attr}]`);
    if (!el) return true;
    try {
      const action = el.getAttribute(`${attr}`);
      const matched = await ActionsService.matchActions(action, viewModel, el, attr);
      const value = el.getAttribute(attr);
      el.removeAttribute(attr);
      el.setAttribute(Constants.FRAMEWORK.ATTRIBUTES.REPEAT_TEMPLATE, value);
      if (matched) {
        await RepeaterService.templateRepeatableItems(viewModel);
        return RepeaterService.renderRepeatableItems();
      }
    } catch (e) {
      logger.error('Failed to render repeaters due to cause:', e);
    }
  }

  public static async renderRepeatableItems(): Promise<any> {
    try {
      const els: any = document.querySelectorAll(`[${Constants.FRAMEWORK.ATTRIBUTES.REPEAT_TEMPLATE}]`);
      for (const el of els) {
        const repeatValue = parseInt(el.getAttribute(`${Constants.FRAMEWORK.ATTRIBUTES.REPEAT_TEMPLATE}`)) - 1;
        for (let index = 0; index < repeatValue; index++) {
          await el.removeAttribute(`${Constants.FRAMEWORK.ATTRIBUTES.REPEAT_TEMPLATE}`);
          const clone = el.cloneNode(true);
          await el.parentNode.insertBefore(clone, el);
        }
      }
      return true;
    } catch (e) {
      logger.error('Failed to find draggable elements', e);
    }
  }
}
