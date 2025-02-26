import { Constants } from '../constants/constants';
import Logger from './logger';
import { ActionsService } from './actions-service';

const logger = new Logger('AttributesService');

export class AttributesService {
  private static flaapAttributes: string[] = [Constants.FRAMEWORK.ATTRIBUTES.CLICK];

  public static async bindAttributes(viewModel: any, querySelector: string): Promise<any> {
    for (const attr of AttributesService.flaapAttributes) {
      await AttributesService.findCustomAttributes(attr, viewModel, querySelector);
    }
    return true;
  }

  private static async findCustomAttributes(attr: string, viewModel: any, querySelector: string): Promise<any> {
    try {
      const wrappers = document.getElementsByTagName(querySelector);
      for (let i = 0; i < wrappers.length; i++) {
        const wrapper = wrappers[i];
        const elements = wrapper.querySelectorAll(`[${attr}]`);
        for (const el of elements) {
          const action = el.getAttribute(`${attr}`);
          el.removeAttribute(attr);
          await ActionsService.matchActions(action, viewModel, el as HTMLElement, attr);
        }
      }
      return true;
    } catch (e) {
      logger.error('Failed to render attributes due to cause:', e);
    }
  }
}
