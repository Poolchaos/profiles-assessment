import { Lifecycle } from './lifecycle';
import { Constants } from '../constants/constants';
import Logger from './logger';
import { ModuleLoader } from './module-loader';
import { customElements } from '../components';
import { CustomComponent } from './custom-element';

const logger = new Logger('Routing');

export class Router {
  public static routes: IRoute[];
  private static container: HTMLElement;
  private static activeRoute: IRoute;

  // Not implemented yet
  private static previousRoute: IRoute;
  private static nextRoute: IRoute;
  private static canNavigateNext: boolean;
  private static canNavigatePrevious: boolean;

  public static async configure(routes: IRoute[]): Promise<any> {
    const container: HTMLElement = document.querySelector(`${Constants.FRAMEWORK.ROUTER}:not([${Constants.FRAMEWORK.ROUTER}-template])`);
    Router.container = container;
    Router.routes = routes;

    window.addEventListener('popstate', () => {
      const currentPath = Router.getCurrentPath();
      Router.loadRoute(currentPath);
    });

    const initialPath = Router.getCurrentPath();
    await Router.loadRoute(initialPath);
    return true;
  }

  private static getCurrentPath(): string {
    return window.location.pathname.substring(1);
  }

  private static loadRoute(newRoute?: string): void {
    Router.clearContent();
    try {
      for (const route of Router.routes) {
        const _route: any = route;
        if (Array.isArray(_route.route) && _route.route.includes(newRoute || '')) {
          Router.route(_route);
          return;
        } else if (typeof _route.route === 'string' && _route.route === (newRoute || '')) {
          Router.route(_route);
          return;
        }
      }
      logger.error(`No route found for '${newRoute || ''}'`);
    } catch (e) {
      logger.error('Failed to load route due to cause:', e);
    }
  }

  private static clearContent(): void {
    try {
      Router.container.innerHTML = '';
    } catch (e) {
      logger.error('No container specified to clear due to cause:', e);
    }
  }

  private static async route(route: IRoute): Promise<any> {
    try {
      if (Router.activeRoute) {
        Lifecycle.deactivate(`${Constants.FRAMEWORK.TEMPLATE}${Router.activeRoute.module}`);
      }
      await ModuleLoader.loadTemplate(route.module, Router.container);

      // customElements.forEach((config) => {
      //   new CustomComponent(config);
      // });
      Router.activeRoute = route;
    } catch (e) {
      logger.error(`Failed to route to '${route.route}' due to cause:`, e);
    }
  }

  public static navigate(route: string, updateUrl: boolean = true): void {
    if (updateUrl) {
      window.history.pushState({}, '', '/' + route);
      try {
        Router.loadRoute(route);
      } catch (e) {
        logger.error(`Failed to route to '${route}' due to cause:`, e);
      }
    } else {
      try {
        Router.loadRoute(route);
      } catch (e) {
        logger.error(`Failed to route to '${route}' due to cause:`, e);
      }
    }
  }
}

export interface IRoute {
  route: string | string[] | any;
  module: string;
  uri?: string;
  title?: string;
}
