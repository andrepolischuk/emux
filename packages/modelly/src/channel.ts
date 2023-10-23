import {Queue} from './utils/queue'
import {setPrivateProperties} from './utils/object'
import {Events} from './events'
import {Listener} from './types'
import {observe} from './observer'

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
  /** Update queue */
  private queue = new Queue()

  /** Event listeners */
  private listeners: Record<string, Listener[]> = {}

  constructor() {
    setPrivateProperties(this, 'queue', 'listeners', 'beforeUpdate')

    return observe(
      this,
      () => this.emit(Events.UPDATE),
      this.queue,
      this.beforeUpdate
    )
  }

  /** Transform model values before update */
  private beforeUpdate(prev: unknown, next: unknown, listener: Listener): void {
    if (prev instanceof Channel) {
      prev.removeListener(Events.UPDATE, listener)
    }

    if (next instanceof Channel) {
      next.on(Events.UPDATE, listener)
    }
  }

  /** Check the listener is registered for a given event */
  hasListener(eventType: string, listener: Listener): boolean {
    return Boolean(this.listeners[eventType]?.includes(listener))
  }

  /**
   * Add a listener for a given event
   *
   * ```ts
   * import {Events} from 'modelly'
   * import {User} from './models'
   *
   * const currentUser = new User()
   *
   * currentUser.on(Events.UPDATE, () => {
   *   // currentUser is fetched
   *   // {displayName: '...', email: '...'}
   * })
   *
   * currentUser.fetch()
   * ```
   */
  on(eventType: string, listener: Listener): void {
    if (!this.hasListener(eventType, listener)) {
      this.listeners[eventType] ??= []
      this.listeners[eventType].push(listener)
    }
  }

  /** Add a one-time listener for a given event */
  once(eventType: string, listener: Listener): void {
    const onceListener = (...args: any[]): unknown => {
      this.off(eventType, onceListener)

      return listener(...args)
    }

    this.on(eventType, onceListener)
  }

  /** Alias for {@link Channel#on} */
  addListener(eventType: string, listener: Listener): void {
    this.on(eventType, listener)
  }

  /** Remove the listeners of a given event */
  removeListener(eventType: string, listener: Listener): void {
    if (this.hasListener(eventType, listener)) {
      this.listeners[eventType]?.splice(
        this.listeners[eventType].indexOf(listener),
        1
      )
    }
  }

  /** Alias for {@link Channel#removeListener} */
  off(eventType: string, listener: Listener): void {
    this.removeListener(eventType, listener)
  }

  /** Calls listeners registered for a given event */
  emit(eventType: string, ...args: any[]): void {
    this.listeners[eventType]?.forEach((listener) => {
      listener(...args)
    })
  }
}
