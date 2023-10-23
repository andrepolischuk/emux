import {Queue} from './utils/queue'
import {setPrivateProperties} from './utils/object'
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
  private listeners: Listener[] = []

  constructor() {
    setPrivateProperties(this, 'queue', 'listeners', 'beforeUpdate')

    return observe(this, () => this.emit(), this.queue, this.beforeUpdate)
  }

  /** Transform model values before update */
  private beforeUpdate(prev: unknown, next: unknown, listener: Listener): void {
    if (prev instanceof Channel) {
      prev.stopListening(listener)
    }

    if (next instanceof Channel) {
      next.listen(listener)
    }
  }

  /** Check the listener is registered for a given event */
  hasListener(listener: Listener): boolean {
    return this.listeners.includes(listener)
  }

  /**
   * Add a listener for a given event
   *
   * ```ts
   * import {User} from './models'
   *
   * const currentUser = new User()
   *
   * currentUser.listen(() => {
   *   // currentUser is fetched
   *   // {displayName: '...', email: '...'}
   * })
   *
   * currentUser.fetch()
   * ```
   */
  listen(listener: Listener): void {
    if (!this.hasListener(listener)) {
      this.listeners.push(listener)
    }
  }

  /** Remove the listeners of a given event */
  stopListening(listener: Listener): void {
    if (this.hasListener(listener)) {
      this.listeners.splice(this.listeners.indexOf(listener), 1)
    }
  }

  /** Calls listeners registered for a given event */
  emit(): void {
    this.listeners.forEach((listener) => {
      listener()
    })
  }
}
