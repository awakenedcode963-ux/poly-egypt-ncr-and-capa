import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../public/assets/polo-egypt-logo.png');
const tempPath = path.resolve(__dirname, '../public/assets/polo-egypt-logo-temp.png');

if (!fs.existsSync(inputPath)) {
  console.log('Logo file not found in public/assets/polo-egypt-logo.png');
  process.exit(1);
}

// Check if image is 1x1 (the dummy one)
const metadata = await sharp(inputPath).metadata();
if (metadata.width === 1 && metadata.height === 1) {
  console.log('Skipping processing: Image is still the 1x1 dummy pixel.');
  process.exit(0);
}

try {
  await sharp(inputPath)
    .trim({
      threshold: 11, // Aggressiveness of trim (remove near-white)
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toFile(tempPath);
  
  fs.renameSync(tempPath, inputPath);
  console.log('✅ Logo successfully trimmed and optimized!');
} catch (error) {
  console.error('Error trimming logo:', error);
}
