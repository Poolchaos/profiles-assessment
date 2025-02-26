import { Lifecycle } from './lifecycle';
import { Constants } from '../constants/constants';
import Logger from './logger';
import { ModuleLoader } from './module-loader';

const logger = new Logger('Routing');

export class Router {
  public static routes: IRoute[];
  private static container: HTMLElement;
  private static activeRoute: IRoute;
  // Store current route parameters
  public static currentParams: { [key: string]: string } = {};

  // Not implemented yet
  private static previousRoute: IRoute;
  private static nextRoute: IRoute;
  private static canNavigateNext: boolean;
  private static canNavigatePrevious: boolean;

  public static async configure(routes: IRoute[]): Promise<any> {
    const container: HTMLElement = document.querySelector(`${Constants.FRAMEWORK.ROUTER}:not([${Constants.FRAMEWORK.ROUTER}-template])`);
    if (!container) {
      logger.error('Router container not found');
      return;
    }
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
    const path = newRoute || Router.getCurrentPath();
    try {
      for (const route of Router.routes) {
        if (typeof route.route === 'string') {
          const { regex, params } = Router.routeToRegex(route.route);
          const match = path.match(regex);
          if (match) {
            Router.currentParams = {};
            params.forEach((param, index) => {
              Router.currentParams[param] = match[index + 1];
            });
            Router.route(route);
            return;
          }
        } else if (Array.isArray(route.route)) {
          if (route.route.includes(path)) {
            Router.currentParams = {};
            Router.route(route);
            return;
          }
        }
      }
      logger.error(`No route found for '${path}'`);
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
      Router.activeRoute = route;
    } catch (e) {
      logger.error(`Failed to route to '${route.route}' due to cause:`, e);
    }
  }

  public static navigate(route: string, updateUrl: boolean = true): void {
    if (updateUrl) {
      window.history.pushState({}, '', '/' + (route || ''));
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

  public static getCurrentParams(): { [key: string]: string } {
    return Router.currentParams;
  }

  private static routeToRegex(route: string): { regex: RegExp; params: string[] } {
    if (route === '') {
      return { regex: /^$/, params: [] };
    }
    const parts = route.split('/');
    const regexParts: string[] = [];
    const params: string[] = [];

    for (const part of parts) {
      if (part.startsWith(':')) {
        params.push(part.slice(1));
        regexParts.push('([^/]+)');
      } else {
        regexParts.push(part);
      }
    }

    const regexStr = '^' + regexParts.join('/') + '$';
    const regex = new RegExp(regexStr);
    return { regex, params };
  }
}

export interface IRoute {
  route: string | string[] | any;
  module: string;
  uri?: string;
  title?: string;
}
