import { ViewLifecycle } from '../../scripts/lifecycle-base';

export class Navbar extends ViewLifecycle {
  value = 'text value';

  constructor() {
    super();
    console.log(' ::>> navbar >>>>>> ');
  }
}
