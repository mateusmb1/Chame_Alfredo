import sharp from 'sharp'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd(), 'public')
const srcSvg = resolve(root, 'alfredo.svg')
const srcPng = resolve(root, 'alfredo.png')
const outWebp = resolve(root, 'alfredo.webp')
const outPng = resolve(root, 'alfredo.png')

async function main() {
  const size = 512
  if (existsSync(srcPng)) {
    const pipeline = sharp(srcPng)
      .trim()
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    const webpBuf = await pipeline.clone().webp({ quality: 90 }).toBuffer()
    writeFileSync(outWebp, webpBuf)
    const pngBuf = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer()
    writeFileSync(outPng, pngBuf)
    console.log('Mascot converted from PNG:', { webp: outWebp, png: outPng })
    return
  }
  const svg = readFileSync(srcSvg)
  const pipeline = sharp(svg, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  const webpBuf = await pipeline.clone().webp({ quality: 90 }).toBuffer()
  writeFileSync(outWebp, webpBuf)
  const pngBuf = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer()
  writeFileSync(outPng, pngBuf)
  console.log('Mascot converted from SVG:', { webp: outWebp, png: outPng })
}

main().catch((err) => {
  console.error('Conversion failed:', err)
  process.exit(1)
})
