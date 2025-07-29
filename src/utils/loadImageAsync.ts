export async function loadImageAsync(url?: string) {
  return new Promise<string | null>((resolve) => {
    const img = new Image()

    if (typeof url !== 'string' || url.length === 0) {
      resolve(null)
      return
    }

    img.onload = () => resolve(url)
    img.onerror = () => resolve(null)

    img.src = url || ''
  })
}
