import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");

const resizeWebp = async (sourceName, outputName, width, quality = 80) => {
  await sharp(path.join(publicDir, sourceName))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(path.join(publicDir, outputName));
};

await resizeWebp("sparclean-logo-hq.png", "sparclean-logo-220.webp", 220, 80);

for (const sourceName of [
  "hero-commercial-man-5.webp",
  "hero-commercial-man-cart-tan-gloves.webp",
  "hero-residential-woman-3.webp",
]) {
  await resizeWebp(sourceName, sourceName.replace(".webp", "-mobile.webp"), 640, 79);
}

for (const sourceName of [
  "care-english-speaking.webp",
  "care-pet-friendly.webp",
  "care-child-friendly.webp",
  "care-senior-friendly.jpg",
]) {
  const extension = path.extname(sourceName);
  await resizeWebp(sourceName, sourceName.replace(extension, `-mobile${extension}`), 720, 79);
}

for (const sourceName of await readdir(path.join(publicDir, "results"))) {
  if (!sourceName.toLowerCase().endsWith(".jpeg")) continue;
  await sharp(path.join(publicDir, "results", sourceName))
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 74, effort: 5 })
    .toFile(path.join(publicDir, "results", sourceName.replace(/\.jpeg$/i, ".webp")));
}

const iconSource = path.join(publicDir, "sparclean-icon.png");
for (const [size, outputName] of [
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"],
  [180, "apple-touch-icon.png"],
  [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
]) {
  await sharp(iconSource)
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(publicDir, outputName));
}

const icoSizes = [16, 32, 48, 256];
const icoImages = await Promise.all(
  icoSizes.map(size =>
    sharp(iconSource)
      .resize(size, size, { fit: "contain" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer(),
  ),
);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoImages.length, 4);
let icoOffset = icoHeader.length + icoImages.length * 16;
const icoEntries = icoImages.map((image, index) => {
  const entry = Buffer.alloc(16);
  const size = icoSizes[index];
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(icoOffset, 12);
  icoOffset += image.length;
  return entry;
});
await writeFile(
  path.join(publicDir, "favicon.ico"),
  Buffer.concat([icoHeader, ...icoEntries, ...icoImages]),
);
