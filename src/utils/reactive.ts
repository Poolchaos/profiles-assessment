import Logger from '../scripts/logger';

const logger = new Logger('Reactive');

export function makeReactive<T>(array: T[], onChange: () => void): T[] {
  return new Proxy(array, {
    set(target, property, value) {
      target[property] = value;
      onChange();
      return true;
    },
    deleteProperty(target, property) {
      delete target[property];
      onChange();
      return true;
    },
  });
}
