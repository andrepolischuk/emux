export function onceAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    const id = requestAnimationFrame(() => {
      cancelAnimationFrame(id)
      resolve()
    })
  })
}
