import { Flaapworks, Logger, ViewLifecycle } from './scripts/flaapworks';

const logger = new Logger('App');

export class App extends ViewLifecycle {
  public test: any = 'says hello';

  constructor() {
    super();
  }

  protected attached(): void {
    console.log(' ::>>  app loaded ------------------------------------- ');
    // Flaapworks.router.configure([
    //   { route: ['', 'home'], module: 'views/home/home', uri: 'Flaapworks' },
    //   { route: 'members', module: 'views/members/members', uri: 'Members' },
    // ]);
  }

  public home(): void {
    Flaapworks.router.navigate('desktop');
  }

  public pageTwo(): void {
    Flaapworks.router.navigate('page-two');
  }
}
