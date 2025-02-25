import { ModuleLoader } from './module-loader';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';
import Logger from './logger';
import { RequestService } from './request-service';
import { AttributesService } from './attributes-service';

const __custom_elements__: { [tagName: string]: CustomElement } = {};
const logger = new Logger('CustomElementConfig');

// todo: cater for use of components within the router

export interface CustomElementConfig {
  tagName: string;
  module: string;
}

class CustomElement {
  private shadowRoots: { [id: string]: ShadowRoot };
  private hosts: { [id: string]: HTMLElement };
  private tagName: string;
  private module: string;
  // private template: string;
  // private viewModel: string;

  constructor(config: CustomElementConfig) {
    this.setupUsables(config);
    this.findInstances();
  }

  private setupUsables(config: CustomElementConfig): void {
    this.shadowRoots = {};
    this.hosts = {};
    this.tagName = config.tagName;
    this.module = config.module;
    // this.template = config.template;
    // this.viewModel = config.viewModel;
  }

  private findInstances(): void {
    const _elements_ = document.querySelectorAll(this.tagName) as NodeListOf<HTMLElement>;
    if (_elements_.length) {
      this.render(_elements_);
    }
  }

  private render(_elements_: NodeListOf<HTMLElement>): void {
    if (this.hasSource()) {
      const elementsArray = Array.from(_elements_);
      for (const el of elementsArray) {
        this.renderSingleElement(el);
      }
    }
  }

  private renderSingleElement(el: HTMLElement): void {
    console.log(' ::>> el >>>> ', el, this.module);
    const _id = uuidv4();
    this.addHost(_id, el);
    this.createShadowDom(_id).then(async () => {
      const container: HTMLElement = document.querySelector(el.tagName.toLowerCase());
      ModuleLoader.loadTemplate(this.module, container);
      // $(this.shadowRoots[_id]).load(this.template, async () => {
      //   const jsContent = await RequestService.fetch(this.viewModel).asJs();
      //   logger.info('jsContent type:', typeof jsContent, 'content:', jsContent);
      //   try {
      //     const script = document.createElement('script');
      //     script.type = 'module';
      //     script.text = jsContent;
      //     this.shadowRoots[_id].appendChild(script);
      //   } catch (e) {
      //     logger.error('errored due to ', e);
      //   }
      // });
    });
  }

  private addHost(_id: string, el: HTMLElement): void {
    el.id = _id;
    this.hosts[_id] = el;
  }

  private createShadowDom(_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // @ts-expect-error type issue
        this.shadowRoots[_id] = this.hosts[_id];

        // toto: resolve shadowDOM issue
        // this.shadowRoots[_id] = this.hosts[_id].attachShadow({ mode: 'open' });
        resolve();
      } catch (e) {
        logger.error('Failed to set shadowroot on component due to ', e);
        reject();
      }
    });
  }

  private hasSource(): boolean {
    if (this.module) {
      return true;
    }
    logger.error('Error: No source specified for component ');
    return false;
  }

  public init(): void {
    this.findInstances();
  }
}

export class CustomComponent {
  constructor(config: CustomElementConfig) {
    if (__custom_elements__[config.tagName]) {
      __custom_elements__[config.tagName].init();
      return;
    }
    __custom_elements__[config.tagName] = new CustomElement(config);
  }
}
