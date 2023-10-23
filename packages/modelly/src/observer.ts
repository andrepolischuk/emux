import {isObject} from './utils/object'

/** Internal observer key */
const OBSERVER = Symbol('observer')

/** Check is observer */
function isObserver(value: any): boolean {
  return !!value && value[OBSERVER]
}

/** Observer callback */
export interface Callback {
  (prevValue: unknown, value: unknown): void
}

/** Create observable event emitter */
export function makeObservable<T extends Record<string, any>>(
  target: T,
  callback: Callback
): T {
  function get(target: any, key: string | symbol): any {
    if (key === OBSERVER) {
      return true
    }

    return target[key]
  }

  function set(target: any, key: string | symbol, value: any): boolean {
    if (target[key] !== value) {
      const prevValue = target[key]

      target[key] =
        isObserver(value) || !isObject(value)
          ? value
          : makeObservable(value, callback)

      callback(prevValue, target[key])
    }

    return true
  }

  function deleteProperty(target: any, key: string | symbol): boolean {
    if (key in target) {
      const prevValue = target[key]

      delete target[key]
      callback(prevValue, undefined)
    }

    return true
  }

  return new Proxy(target, {get, set, deleteProperty})
}
