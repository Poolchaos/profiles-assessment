import Logger from './logger';

const logger = new Logger('Reactive');

export function makeReactive<T>(target: any, onChange: () => void): T {
  return new Proxy(target, {
    set(target, property, value) {
      if (property === '_viewModelId') {
        target[property] = value;
        return true;
      }
      const oldValue = target[property];
      target[property] = value;
      if (oldValue !== value) {
        onChange();
      }
      return true;
    },
    deleteProperty(target, property) {
      delete target[property];
      onChange();
      return true;
    },
  });
}
