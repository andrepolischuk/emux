export function isObject(value: unknown): boolean {
  return !!value && typeof value === 'object'
}

export function setPrivateProperties(
  target: Record<string, any>,
  ...keys: string[]
): void {
  keys.forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: false,
      enumerable: false,
      writable: true,
      value: target[key]
    })
  })
}
