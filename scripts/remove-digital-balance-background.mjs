import sharp from "sharp";
import { dirname, join } from "node:path";

const root = process.cwd();
const source = join(root, "public", "images", "araclar", "digital-balance-hero", "tools-digital-balance-calculator-v1-1200.webp");
const outputDirectory = dirname(source);
const baseName = "tools-digital-balance-calculator-v2-transparent";

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixelCount = width * height;
const background = [data[0], data[1], data[2], data[3]];

// The source already carries an alpha channel: the unwanted red plate is
// semi-transparent while the product composition is opaque. Remap that alpha
// range instead of color-keying red, so the red highlights on the cards and
// calculator stay intact.
for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
  const alphaOffset = (pixelIndex * channels) + 3;
  const sourceAlpha = data[alphaOffset];
  if (sourceAlpha <= 220) {
    data[alphaOffset] = 0;
  } else if (sourceAlpha >= 248) {
    data[alphaOffset] = 255;
  } else {
    data[alphaOffset] = Math.round(((sourceAlpha - 220) / 28) * 255);
  }
}

const transparentPng = await sharp(data, { raw: { width, height, channels } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

for (const targetWidth of [480, 960]) {
  const resized = sharp(transparentPng).resize({ width: targetWidth, withoutEnlargement: true });
  await resized.clone().webp({ quality: 70, alphaQuality: 86, effort: 6 }).toFile(join(outputDirectory, `${baseName}-${targetWidth}.webp`));
  await resized.clone().avif({ quality: 37, effort: 7, chromaSubsampling: "4:4:4" }).toFile(join(outputDirectory, `${baseName}-${targetWidth}.avif`));
}

const metadata = await sharp(transparentPng).metadata();
console.log(JSON.stringify({ baseName, width: metadata.width, height: metadata.height, background }, null, 2));
