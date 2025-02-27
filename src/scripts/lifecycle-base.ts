import { Eventing, IMessage } from './event-bus';
import Logger from './logger';
import { makeReactive } from '../utils/reactive';
import { RepeaterService } from './repeater-service';
import { ModuleLoader } from './module-loader';
import { ValueService } from './value-service';
import { BindingService } from './binding-service';
import { Constants } from '../constants/constants';

let logger: Logger;

export class ViewLifecycle {
  protected _viewModelId: string;
  protected _templateId: string;
  private reactiveCallbacks: { [key: string]: () => void } = {};
  private itemVarMap: { [key: string]: string } = {};

  constructor() {
    logger = new Logger(this.constructor.name);
  }

  protected activate() {
    logger.debug('Activate has not been implemented. Call super.activate(); to overwrite.');
  }

  protected attached() {
    logger.debug('Attached has not been implemented. Call super.attached(); to overwrite.');
  }

  protected subscribe(eventName: string, callback: (event: IMessage) => void): void {
    Eventing.subscribe(eventName, callback);
  }

  protected deactivate() {
    logger.debug('Deactivate has not been implemented. Call super.deactivate(); to overwrite.');

    delete ModuleLoader.templates[this._templateId];
  }

  protected makeArrayReactive<T>(arrayName: string, array: T[], itemVar: string): T[] {
    this.itemVarMap[arrayName] = itemVar;
    const onChange = () => this.updateRepeatableItems(arrayName);
    this.reactiveCallbacks[arrayName] = onChange;
    return makeReactive(array, onChange);
  }

  private updateRepeatableItems(arrayName: string): void {
    const itemVar = this.itemVarMap[arrayName];
    if (!itemVar) {
      logger.error(`No itemVar found for array "${arrayName}"`);
      return;
    }
    RepeaterService.renderRepeatableItems(this, arrayName, itemVar);
  }

  protected makeObjectReactive<T>(objectName: string, object: { [key: string]: any }): { [key: string]: any } {
    this.itemVarMap[objectName] = objectName;
    const onChange = () => this.reRenderTemplate();
    this.reactiveCallbacks[objectName] = onChange;
    return makeReactive(object, onChange);
  }

  public async reRenderTemplate(): Promise<void> {
    const templateHtml = ModuleLoader.templates[this._templateId].template;
    const renderedHtml = await ValueService.bindBindableValues(templateHtml, this);
    const container = document.querySelector(`[id="${this._viewModelId}"]`);
    if (container) {
      container.innerHTML = renderedHtml;
      BindingService.processIfConditions(this);
      const splitModuleId = this._templateId.split('/');
      const tagName = splitModuleId[splitModuleId.length - 1];
      BindingService.bindAttributes(this, tagName);
    } else {
      logger.error(`No container found for view model ID: ${this._viewModelId}`);
    }
  }
}
