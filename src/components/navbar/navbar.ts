import { ViewLifecycle } from '../../scripts/lifecycle-base';
import { Router } from '../../scripts/router';

import './navbar.scss';

export class Navbar extends ViewLifecycle {
  public menuItems = [
    { name: 'Home', icon: 'home', route: '' },
    { name: 'Profiles', icon: 'users', route: 'profiles' },
    { name: 'Favourites', icon: 'star', route: 'favourites' },
    { name: 'My Matches', icon: 'heart', route: 'my-matches' },
    { name: 'Mailbox', icon: 'envelope', route: 'mailbox', count: 9 },
    { name: 'Buy credits', icon: 'money-bill-1', route: 'buy-credits' },
  ];

  constructor() {
    super();
  }

  public navTo(route: string): void {
    console.log(' ::>> route >>>>>> ', route);
    Router.navigate(route);
  }
}
