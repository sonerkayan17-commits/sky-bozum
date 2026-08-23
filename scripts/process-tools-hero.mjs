import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const source = process.argv[2];
const outputDir = process.argv[3];

if (!source || !outputDir) {
  throw new Error('Usage: node scripts/process-tools-hero.cjs <source.png> <output-dir>');
}

async function createTransparentMaster() {
  const image = sharp(source).removeAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.alloc(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    const inputOffset = index * channels;
    const outputOffset = index * 4;
    const red = data[inputOffset];
    const green = data[inputOffset + 1];
    const blue = data[inputOffset + 2];
    const rawAlpha = Math.max(red, 255 - green, 255 - blue);
    const alpha = rawAlpha <= 14 ? 0 : Math.min(255, Math.round((rawAlpha - 14) * (255 / 241)));
    const normalizedAlpha = alpha / 255;

    rgba[outputOffset] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round(red / normalizedAlpha)));
    rgba[outputOffset + 1] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round((green - (1 - normalizedAlpha) * 255) / normalizedAlpha)));
    rgba[outputOffset + 2] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round((blue - (1 - normalizedAlpha) * 255) / normalizedAlpha)));
    rgba[outputOffset + 3] = alpha;
  }

  await fs.mkdir(outputDir, { recursive: true });
  const transparent = sharp(rgba, { raw: { width, height, channels: 4 } });
  const master = path.join(outputDir, 'tools-digital-balance-calculator-v1.png');
  await transparent
    .resize({ width: 2160, height: 2700, fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 100 })
    .toFile(master);

  const variants = [
    ['tools-digital-balance-calculator-v1-480.webp', 480, 74],
    ['tools-digital-balance-calculator-v1-768.webp', 768, 76],
    ['tools-digital-balance-calculator-v1-1200.webp', 1200, 78],
  ];

  await Promise.all(variants.map(([name, widthValue, quality]) =>
    sharp(master)
      .resize({ width: widthValue, withoutEnlargement: true })
      .webp({ quality, alphaQuality: 92, effort: 6, smartSubsample: true })
      .toFile(path.join(outputDir, name))
  ));

  const avifVariants = [
    ['tools-digital-balance-calculator-v1-480.avif', 480, 46],
    ['tools-digital-balance-calculator-v1-768.avif', 768, 48],
    ['tools-digital-balance-calculator-v1-1200.avif', 1200, 50],
  ];

  await Promise.all(avifVariants.map(([name, widthValue, quality]) =>
    sharp(master)
      .resize({ width: widthValue, withoutEnlargement: true })
      .avif({ quality, effort: 6, chromaSubsampling: '4:4:4' })
      .toFile(path.join(outputDir, name))
  ));

  const metadata = await sharp(master).metadata();
  const files = await Promise.all([master, ...variants.map(([name]) => path.join(outputDir, name)), ...avifVariants.map(([name]) => path.join(outputDir, name))].map(async (file) => ({
    file,
    bytes: (await fs.stat(file)).size,
  })));
  console.log(JSON.stringify({ metadata, files }, null, 2));
}

createTransparentMaster();
