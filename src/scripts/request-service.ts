import Logger from './logger';
import { BindingService } from './binding-service';

const logger = new Logger('RequestService');

export class RequestService {
  public static fetch(ModuleName: string): { asHtml: () => string; asTs: () => any } {
    return {
      asHtml: () => {
        try {
          return require(`!!raw-loader!../${ModuleName}.html`).default;
        } catch (e) {
          logger.error(`Failed to get html resource ${ModuleName} due to cause:`, e);
        }
      },
      asTs: () => {
        try {
          return require(`../${ModuleName}.ts`);
        } catch (e) {
          logger.error(`Failed to get ts resource ${ModuleName} due to cause:`, e);
        }
      },
    };
  }

  public static parseHtmlString(htmlString: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
  }

  public static async parseXmlString(moduleName: string, templateId: string, htmlString: string): Promise<any> {
    try {
      const doc: any = RequestService.parseHtmlString(htmlString);
      const script = document.createElement('script');
      script.id = templateId;
      script.type = 'text/template';
      await script.insertAdjacentHTML('afterbegin', doc.body.innerHTML);
      return script;
    } catch (e) {
      logger.error(`Failed to parse module '${moduleName}' due to cause:`, e);
    }
  }

  public static async parseFetchedXml(moduleName: string, templateId: string): Promise<any> {
    try {
      let htmlString: string = await RequestService.fetch(moduleName).asHtml();
      htmlString = await BindingService.identifyTemplateElements(htmlString);
      const doc: any = RequestService.parseHtmlString(htmlString);
      const script = document.createElement('script');
      script.id = templateId;
      script.type = 'text/template';
      await script.appendChild(doc.head.firstChild.content);
      return script;
    } catch (e) {
      logger.error(`Failed to parse module '${moduleName}' due to cause:`, e);
    }
  }
}
