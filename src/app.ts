import { Logger, Router, ViewLifecycle } from './scripts/flaapworks';
const logger = new Logger('App');

export class App extends ViewLifecycle {
  public test: string = 'says hello';

  constructor() {
    super();
  }

  protected attached(): void {
    Router.configure([
      { route: ['', 'profile-overview'], module: 'views/profile-overview/profile-overview', uri: 'Flaapworks' },
      { route: 'single-profile', module: 'views/single-profile/single-profile', uri: 'single-profile' },
    ]);
  }

  public navigateToProfileOverview(): void {
    Router.navigate('profile-overview');
  }

  public navigateToSingleProfile(): void {
    Router.navigate('single-profile');
  }
}
