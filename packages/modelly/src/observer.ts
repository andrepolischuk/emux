import {Queue} from './utils/queue'
import {isObject} from './utils/object'
import {Listener} from './types'

const observerKey = Symbol('observer')

function isObserver(value: any): boolean {
  return !!value && value[observerKey]
}

interface BeforeUpdate {
  (prev: unknown, next: unknown, update: Listener): void
}

export function observe<T extends Record<string, any>>(
  target: T,
  queue: Queue,
  update: Listener,
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
      beforeUpdate(target[key], value, update)

      target[key] =
        isObserver(value) || !isObject(value)
          ? value
          : observe(value, queue, update, beforeUpdate)

      queue.push(update)
    }

    return true
  }

  function deleteProperty(target: any, key: string | symbol): boolean {
    if (key in target) {
      beforeUpdate(target[key], undefined, update)
      delete target[key]
      queue.push(update)
    }

    return true
  }

  return new Proxy(target, {get, set, deleteProperty})
}
