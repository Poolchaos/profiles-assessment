import { AttributesService } from './attributes-service';
import { ValueService } from './value-service';
import { RepeaterService } from './repeater-service';
import Logger from './logger';

import { ActionsService } from './actions-service';
import { TagsService } from './tags-service';
import { ModuleLoader } from './module-loader';
import { RequestService } from './request-service';

const logger = new Logger('BindingService');

export class BindingService {
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
    templateHtml = await ValueService.bindBindableValues(templateHtml, _viewModel);
    templateHtml = await BindingService.removeTemplateIdentities(templateHtml);
    return { templateHtml, viewModel: _viewModel };
  }

  public static async templateRepeatableItems(viewModel: any): Promise<any> {
    await RepeaterService.templateRepeatableItems(viewModel);
  }

  public static async bindAttributes(viewModel: any): Promise<any> {
    await AttributesService.bindAttributes(viewModel);
  }
}
