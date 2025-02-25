import { ViewLifecycle } from '../../scripts/lifecycle-base';
import { Router } from '../../scripts/router';

import './navbar.scss';

export class Navbar extends ViewLifecycle {
  public menuItems = [
    { name: 'Home', icon: 'home', route: '' },
    { name: 'Profiles', icon: 'users', route: 'profiles' },
    { name: 'Favourites', icon: 'star', route: 'favourites' },
    { name: 'My Matches', icon: 'heart', route: 'my-matches' },
    { name: 'Mailbox', icon: 'enveloper', route: 'mailbox' },
    { name: 'Buy credits', icon: 'money', route: 'buy-credits' },
  ];

  constructor() {
    super();
    console.log(' ::>> navbar >>>>>> ');
  }

  public navTo(route: string): void {
    Router.navigate(route);
  }
}
