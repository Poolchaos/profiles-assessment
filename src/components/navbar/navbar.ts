import { ViewLifecycle } from '../../scripts/lifecycle-base';

console.log('+++++++++++++++++++++++++++++++++++++++++++');
export class Navbar extends ViewLifecycle {
  value = 'text value';

  coonstructor() {
    console.log(' ::>> navbar >>>>>> ');
  }
}
