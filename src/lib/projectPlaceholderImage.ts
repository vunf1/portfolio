/** True when `image` points at a generated SVG tile under `public/img/projects/` (not a PNG/logo). */
export function isProjectPlaceholderAsset(imagePath: string | undefined): boolean {
  const p = imagePath?.trim()
  if (!p) {
    return false
  }
  const base = p.split(/[#?]/)[0] ?? ''
  return /\.svg$/i.test(base)
}
