import Logger from './logger';
import { BindingService } from './binding-service';

let logger = new Logger('RequestService');
export class RequestService {
  public static fetch(ModuleName: string): { asHtml: () => string; asTs: () => any } {
    return {
      asHtml: () => {
        console.log(' ::>> require(`html-loader!../${ModuleName}.html`) >>>> ', require(`!!raw-loader!../${ModuleName}.html`).default);
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
      let doc: any = RequestService.parseHtmlString(htmlString);
      let script = document.createElement('script');
      script.id = templateId;
      script.type = 'text/template';
      console.log(' ::>> rendering template >>>>> ', doc.body.innerHTML);
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
      let doc: any = RequestService.parseHtmlString(htmlString);
      let script = document.createElement('script');
      console.log(' ::>> htmlString >>>>> 4 ', { head: doc.head });
      script.id = templateId;
      script.type = 'text/template';
      await script.appendChild(doc.head.firstChild.content);
      return script;
    } catch (e) {
      logger.error(`Failed to parse module '${moduleName}' due to cause:`, e);
    }
  }
}
