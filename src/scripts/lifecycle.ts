import Logger from './logger';
import { ModuleLoader } from './module-loader';

const logger = new Logger('Lifecycle');

export class Lifecycle {
  private static LIFE_CYCLE: any = {
    ACTIVATE: 'activate',
    ATTACHED: 'attached',
    DEACTIVATE: 'deactivate',
  };

  public static activate(templateId: string): void {
    try {
      ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.ACTIVATE] && ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.ACTIVATE]();
    } catch (e) {
      logger.error(`Failed to initialise lifecycle method '${Lifecycle.LIFE_CYCLE.ACTIVATE}' due to cause:`, e);
    }
  }

  public static attached(templateId: string): void {
    try {
      ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.ATTACHED] && ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.ATTACHED]();
    } catch (e) {
      logger.error(`Failed to initialise lifecycle method '${Lifecycle.LIFE_CYCLE.ATTACHED}' due to cause:`, e);
    }
  }

  public static deactivate(templateId: string): void {
    try {
      ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.DEACTIVATE] && ModuleLoader.templates[templateId].viewModel[Lifecycle.LIFE_CYCLE.DEACTIVATE]();
    } catch (e) {
      logger.error(`Failed to initialise lifecycle method '${Lifecycle.LIFE_CYCLE.DEACTIVATE}' due to cause:`, e);
    }
  }
}
