import { AttributesService } from './attributes-service';
import { ValueService } from './value-service';
import { RepeaterService } from './repeater-service';
import Logger from '../utils/logger';
import { TagsService } from './tags-service';
import { ModuleLoader } from './module-loader';
import { Constants } from '../constants/constants';
import { makeReactive } from '../utils/reactive';

const logger = new Logger('BindingService');

export class BindingService {
  public static viewModelsById: Map<string, any> = new Map();

  public static async identifyTemplateElements(htmlString: string): Promise<any> {
    htmlString = await TagsService.identifyTags(htmlString);
    return htmlString;
  }

  public static async removeTemplateIdentities(htmlString: string): Promise<any> {
    htmlString = await TagsService.removeTemplateIdentities(htmlString);
    return htmlString;
  }

  public static async attachViewModelToTemplate(templateId: string, templateHtml: any, viewModel: any): Promise<any> {
    let _viewModel;
    if (typeof viewModel === 'object') {
      _viewModel = viewModel;
    } else if (typeof viewModel === 'function') {
      _viewModel = await new viewModel();
      await ModuleLoader.storeTemplate(templateId, templateHtml, _viewModel);
    }

    BindingService.viewModelsById.set(_viewModel._viewModelId, _viewModel);

    _viewModel = makeReactive(_viewModel, () => BindingService.updateIfConditions(_viewModel._viewModelId));

    templateHtml = await ValueService.bindBindableValues(templateHtml, _viewModel);
    await this.processIfConditions(_viewModel);
    templateHtml = await BindingService.removeTemplateIdentities(templateHtml);
    return { templateHtml, viewModel: _viewModel };
  }

  public static async templateRepeatableItems(viewModel: any): Promise<any> {
    await RepeaterService.templateRepeatableItems(viewModel);
  }

  public static async bindAttributes(viewModel: any, querySelector: string): Promise<any> {
    await AttributesService.bindAttributes(viewModel, querySelector);
  }

  public static async processIfConditions(viewModel: any): Promise<void> {
    const ifAttr = Constants.FRAMEWORK.ATTRIBUTES.IF;
    const elements = document.querySelectorAll(`[${ifAttr}]`);
    const viewModelId = viewModel._viewModelId;
    elements.forEach((element: HTMLElement) => {
      if (element.hasAttribute('data-if')) {
        return;
      }
      const condition = element.getAttribute(ifAttr)?.trim();
      if (condition) {
        if (condition === 'false' || condition === 'true') {
          logger.info(`Unexpected condition "${condition}" set for`, element);
        }
        element.setAttribute('data-if', condition);
        element.setAttribute('data-viewmodel-id', viewModelId);
        const value = this.evaluateIfCondition(condition, viewModel);
        element.style.display = value ? '' : 'none';
      }
    });
  }

  public static async updateIfConditions(viewModelId: string): Promise<void> {
    const viewModel = BindingService.viewModelsById.get(viewModelId);
    if (!viewModel) {
      logger.error(`No view model found for ID: ${viewModelId}`);
      return;
    }
    const elements = document.querySelectorAll(`[data-viewmodel-id="${viewModelId}"][data-if]`);
    elements.forEach((element: HTMLElement) => {
      const condition = element.getAttribute('data-if');
      const value = this.evaluateIfCondition(condition, viewModel);
      element.style.display = value ? '' : 'none';
    });
  }

  private static evaluateIfCondition(condition: string, viewModel: any): boolean {
    condition = condition.trim();
    let invert = false;
    while (condition.startsWith('!')) {
      invert = !invert;
      condition = condition.slice(1).trim();
    }
    try {
      const value = condition.split('.').reduce((obj, key) => obj?.[key], viewModel);
      return invert ? !value : !!value;
    } catch (e) {
      logger.error(`Failed to evaluate condition "${condition}"`, e);
      return false;
    }
  }
}
