import {Listener} from '../types'

const isSSR = typeof window === 'undefined'

const setImmediate = isSSR
  ? globalThis.setImmediate
  : window.requestAnimationFrame

const clearImmediate = isSSR
  ? globalThis.clearImmediate
  : window.cancelAnimationFrame

export class Queue {
  id?: any

  push(callback: Listener): void {
    clearImmediate(this.id)
    this.id = setImmediate(() => callback())
  }
}
