/** Event listener */
export interface Listener<T = void> {
  (data: T): void
}
