import { Logger, Router, ViewLifecycle } from './scripts/flaapworks';

const logger = new Logger('App');

export class App extends ViewLifecycle {
  public test: string = 'says hello';

  constructor() {
    super();
  }

  protected attached(): void {
    Router.configure([
      {
        route: ['', 'profiles'], //
        module: 'views/profiles/profiles',
      },
      {
        route: 'profile-overview/:id', //
        module: 'views/profile-overview/profile-overview',
      },
    ]);
  }
}
