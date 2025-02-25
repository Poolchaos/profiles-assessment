import { Constants } from '../constants/constants';
import Logger from './logger';

const logger = new Logger('TagsService');

export class TagsService {
  private static flaapTags: string[] = [Constants.FRAMEWORK.ROUTER];

  public static async identifyTags(htmlString: string): Promise<any> {
    for (const tag of TagsService.flaapTags) {
      htmlString = htmlString.replace(`<${tag}>`, `<${tag} ${tag}-template>`);
    }
    return htmlString;
  }

  public static async removeTemplateIdentities(htmlString: string): Promise<any> {
    for (const tag of TagsService.flaapTags) {
      htmlString = htmlString.replace(new RegExp(tag + '-template', 'g'), ``);
    }
    return htmlString;
  }
}
