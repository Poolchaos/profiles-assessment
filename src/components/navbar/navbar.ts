import { Account } from '../../models/account';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { Router } from '../../scripts/router';
import { httpService } from '../../services/http-service';

import './navbar.scss';

const logger = new Logger('Navbar');

export class Navbar extends ViewLifecycle {
  public menuItems = [
    { name: 'Home', icon: 'home', route: '' },
    { name: 'Profiles', icon: 'users', route: 'profiles' },
    { name: 'Favourites', icon: 'star', route: 'favourites' },
    { name: 'My Matches', icon: 'heart', route: 'my-matches' },
    { name: 'Mailbox', icon: 'envelope', route: 'mailbox', count: 9 },
    { name: 'Buy credits', icon: 'money-bill-1', route: 'buy-credits' },
  ];
  public isMobileMenuOpen = false;
  public account: Account = {
    UID: null,
    active: null,
    age: null,
    lastActiveAt: null,
    username: null,
    notifications: 9,
    credit: 0,
  };

  constructor() {
    super();
    this.isMobileMenuOpen = false;
  }

  protected activate(): void {
    this.loadAccount();
  }

  private async loadAccount(): Promise<Record<string, number[]>> {
    try {
      const response = await httpService.get<{ account: Record<string, number[]> }>('account');
      console.log(' ::>> acount = ', response);
      Object.assign(this.account, response);
    } catch (error) {
      logger.error('Failed to load favorites', error);
      return {};
    }
  }

  public navTo(route: string): void {
    this.isMobileMenuOpen = false;
    Router.navigate(route);
  }

  public toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log(' ::>> this.isMobileMenuOpen >>>> ', this.isMobileMenuOpen);
  }
}
