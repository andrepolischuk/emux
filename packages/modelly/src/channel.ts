import {Queue} from './utils/queue'
import {setPrivateProperties} from './utils/object'
import {makeObservable, Callback} from './observer'

/** Channel update event */
const UPDATE = 'update'

/** Create an observer callback */
function createCallback(channel: Channel): Callback {
  const queue = new Queue()
  const listener = (): void => channel.emit(UPDATE)

  return (prevValue: unknown, value: unknown) => {
    if (prevValue instanceof Channel) {
      prevValue.removeListener(UPDATE, listener)
    }

    if (value instanceof Channel) {
      value.on(UPDATE, listener)
    }

    queue.push(listener)
  }
}

/** Event listener */
export interface Listener {
  (...args: any[]): void
}

/**
 * Model update channel
 *
 * ```ts
 * import {Channel} from 'modelly'
 * import * as api from './api'
 *
 * export class User extends Channel {
 *   displayName?: string
 *   email?: string
 *
 *   async fetch() {
 *     const {displayName, email} = await api.getCurrentUser()
 *     this.displayName = displayName
 *     this.email = email
 *   }
 * }
 * ```
 */
export class Channel {
  /** Event listeners */
  private listeners: Record<string | symbol, Listener[]> = {}

  constructor() {
    setPrivateProperties(this, 'listeners')

    return makeObservable(this, createCallback(this))
  }

  /** Check the listener is registered for a given event */
  hasListener(eventType: string | symbol, listener: Listener): boolean {
    return Boolean(this.listeners[eventType]?.includes(listener))
  }

  /** Add a listener for a given event */
  on(eventType: string | symbol, listener: Listener): void {
    if (!this.hasListener(eventType, listener)) {
      this.listeners[eventType] ??= []
      this.listeners[eventType].push(listener)
    }
  }

  /** Add a one-time listener for a given event */
  once(eventType: string | symbol, listener: Listener): void {
    const onceListener = (...args: any[]): unknown => {
      this.off(eventType, onceListener)

      return listener(...args)
    }

    this.on(eventType, onceListener)
  }

  /** Alias for {@link Channel#on} */
  addListener(eventType: string | symbol, listener: Listener): void {
    this.on(eventType, listener)
  }

  /** Wait a given event one-time */
  wait(eventType: string | symbol): Promise<void> {
    return new Promise((resolve) => this.once(eventType, resolve))
  }

  /** Remove the listener of a given event */
  removeListener(eventType: string | symbol, listener: Listener): void {
    if (this.hasListener(eventType, listener)) {
      this.listeners[eventType]?.splice(
        this.listeners[eventType].indexOf(listener),
        1
      )
    }
  }

  /** Alias for {@link Channel#removeListener} */
  off(eventType: string | symbol, listener: Listener): void {
    this.removeListener(eventType, listener)
  }

  /** Calls listeners registered for a given event */
  emit(eventType: string | symbol, ...args: any[]): void {
    const listeners = [...(this.listeners[eventType] ?? [])]

    listeners?.forEach((listener) => {
      listener(...args)
    })
  }
}
