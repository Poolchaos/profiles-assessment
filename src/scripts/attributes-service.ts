import { Constants } from '../constants/constants';
import Logger from './logger';
import { ActionsService } from './actions-service';

const logger = new Logger('AttributesService');

export class AttributesService {
  private static flaapAttributes: string[] = [Constants.FRAMEWORK.ATTRIBUTES.CLICK];

  public static async bindAttributes(viewModel: any): Promise<any> {
    for (const attr of AttributesService.flaapAttributes) {
      await AttributesService.findCustomAttributes(attr, viewModel);
    }
    return true;
  }

  private static async findCustomAttributes(attr: string, viewModel: any): Promise<any> {
    try {
      const el: any = document.querySelector(`[${attr}]`);
      if (el) {
        const action = el.getAttribute(`${attr}`);
        el.removeAttribute(attr);
        await ActionsService.matchActions(action, viewModel, el, attr);
        return AttributesService.findCustomAttributes(attr, viewModel);
      }
      return true;
    } catch (e) {
      logger.error('Failed to render attributes due to cause:', e);
    }
  }
}
