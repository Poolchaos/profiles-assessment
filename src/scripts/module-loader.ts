import Logger from './logger';
import { RequestService } from './request-service';
import { BindingService } from './binding-service';
import { Constants } from '../constants/constants';
import { Lifecycle } from './lifecycle';

const logger = new Logger('ModuleLoader');

export class ModuleLoader {
  public static templates: any = {};

  public static async initialise(): Promise<any> {
    try {
      const container: HTMLElement = document.querySelector(`body[${Constants.FRAMEWORK.ENTRY}]`);
      const entry = container.getAttribute(`${Constants.FRAMEWORK.ENTRY}`);
      await this.loadTemplate(entry, container);
      return true;
    } catch (e) {
      logger.error('Failed to initialise app due to cause:', e);
    }
  }

  public static async loadTemplate(moduleName: string, container: HTMLElement): Promise<any> {
    try {
      const templateId: string = `${Constants.FRAMEWORK.TEMPLATE}${moduleName}`;
      if (ModuleLoader.existingModuleRendered(moduleName, container, templateId)) return true;
      const template: HTMLElement = await RequestService.parseFetchedXml(moduleName, templateId);
      const viewModel: any = await ModuleLoader.fetchViewModel(moduleName, template);
      await ModuleLoader.renderTemplate(template, container);
      await ModuleLoader.renderModule(templateId, viewModel);
      return true;
    } catch (e) {
      logger.error('Failed to load template due to cause:', e);
    }
  }

  private static existingModuleRendered(moduleName: string, container: HTMLElement, templateId: string): any {
    if (ModuleLoader.templates[templateId]) {
      ModuleLoader.rerenderModule(moduleName, templateId, container);
      return true;
    }
    return false;
  }

  private static async rerenderModule(moduleName: string, templateId: string, container: HTMLElement): Promise<any> {
    const template: HTMLElement = await RequestService.parseXmlString(moduleName, templateId, ModuleLoader.templates[templateId].template);
    await ModuleLoader.renderTemplate(template, container);
    await ModuleLoader.renderModule(templateId, ModuleLoader.templates[templateId].viewModel);
    return true;
  }

  private static fetchViewModel(moduleName: string, template: HTMLElement): void {
    const ts = RequestService.fetch(moduleName).asTs();
    try {
      for (const _class in ts) {
        if (Object.prototype.hasOwnProperty.call(ts, _class) && typeof ts[_class] === 'function') {
          return ts[_class];
        }
      }
    } catch (e) {
      logger.error('Failed to initialise class due to ', e);
    }
  }

  public static storeTemplate(templateId: string, template: string, viewModel: any): boolean {
    try {
      if (ModuleLoader.templates[templateId]) {
        throw new Error(`Duplicate module '${templateId.replace(`${Constants.FRAMEWORK.TEMPLATE}`, '')}' detected`);
      }
      ModuleLoader.templates[templateId] = { template, viewModel };
      return true;
    } catch (e) {
      logger.error(`Failed to create template due to cause:`, e);
    }
  }

  private static renderTemplate(template: HTMLElement, container: HTMLElement): boolean {
    container.appendChild(template);
    return true;
  }

  private static async renderModule(templateId: string, viewModel: any): Promise<any> {
    try {
      const template: any = document.querySelector(`[id="${templateId}"]`);
      const templateHtml = template.innerHTML;
      const module = await BindingService.attachViewModelToTemplate(templateId, templateHtml, viewModel);
      await Lifecycle.activate(templateId);
      await ModuleLoader.renderTemplateBindings(template, module.templateHtml);
      await ModuleLoader.tryDestroyRenderedTemplate(templateId);
      await BindingService.templateRepeatableItems(module.viewModel);
      await BindingService.bindAttributes(module.viewModel);
      await Lifecycle.attached(templateId);
      return true;
    } catch (e) {
      logger.error('Failed to render template due to cause:', e);
    }
  }

  public static async renderTemplateBindings(template: any, templateHtml: string): Promise<any> {
    await template.parentNode.insertAdjacentHTML('afterbegin', RequestService.parseHtmlString(templateHtml).body.innerHTML);
    return true;
  }

  private static tryDestroyRenderedTemplate(templateId: string): void {
    try {
      const template = document.querySelector(`[id="${templateId}"]`);
      template.remove();
    } catch (e) {
      logger.error('Failed to remove rendered template due to cause:', e);
    }
  }
}
