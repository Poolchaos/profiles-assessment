import { ViewLifecycle } from '../../scripts/lifecycle-base';

import './navbar.scss';

export class Navbar extends ViewLifecycle {
  value = 'text value';

  constructor() {
    super();
    console.log(' ::>> navbar >>>>>> ');
  }
}
