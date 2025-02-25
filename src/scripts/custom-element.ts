import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';

const __custom_elements__: { [tagName: string]: CustomElement } = {};

// todo: cater for use of components within the router

export interface CustomElementConfig {
  tagName: string;
  template: string;
  viewModel: string;
}

class CustomElement {
  private shadowRoots: { [id: string]: ShadowRoot };
  private hosts: { [id: string]: HTMLElement };
  private tagName: string;
  private template: string;
  private viewModel: string;

  constructor(config: CustomElementConfig) {
    this.setupUsables(config);
    this.findInstances();
  }

  private setupUsables(config: CustomElementConfig): void {
    this.shadowRoots = {};
    this.hosts = {};
    this.tagName = config.tagName;
    this.template = config.template;
    this.viewModel = config.viewModel;
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
    const _id = uuidv4();
    this.addHost(_id, el);
    this.createShadowDom(_id).then(
      () => {
        $(this.shadowRoots[_id]).load(this.template);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.viewModel;
        this.shadowRoots[_id].appendChild(script);
      },
      () => {
        $(el).load(this.template);
      }
    );
  }

  private addHost(_id: string, el: HTMLElement): void {
    el.id = _id;
    this.hosts[_id] = el;
  }

  private createShadowDom(_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.shadowRoots[_id] = this.hosts[_id].attachShadow({ mode: 'open' });
        resolve();
      } catch (e) {
        console.log('%c something is wrong with your custom element! this is not a problem with flaap-gallery, but between the chair and the computer. ', 'color:#9D2933;');
        reject();
      }
    });
  }

  private hasSource(): boolean {
    if (this.template) {
      return true;
    }
    console.log('%c no source specified for component ', 'color:#9D2933;');
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
