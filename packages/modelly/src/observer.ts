import {Queue} from './utils/queue'
import {isObject} from './utils/object'
import {Listener} from './types'

const observerKey = Symbol('observer')

export function isObserver(value: any): boolean {
  return !!value && value[observerKey]
}

export interface BeforeUpdate {
  (prev: unknown, next: unknown, listener: Listener): void
}

export function observe<T extends Record<string, any>>(
  target: T,
  listener: Listener,
  queue: Queue,
  beforeUpdate: BeforeUpdate
): T {
  function get(target: any, key: string | symbol): any {
    if (key === observerKey) {
      return true
    }

    return target[key]
  }

  function set(target: any, key: string | symbol, value: any): boolean {
    if (target[key] !== value) {
      beforeUpdate(target[key], value, listener)

      target[key] =
        isObserver(value) || !isObject(value)
          ? value
          : observe(value, listener, queue, beforeUpdate)

      queue.push(listener)
    }

    return true
  }

  function deleteProperty(target: any, key: string | symbol): boolean {
    if (key in target) {
      beforeUpdate(target[key], undefined, listener)
      delete target[key]
      queue.push(listener)
    }

    return true
  }

  return new Proxy(target, {get, set, deleteProperty})
}
