import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../public/assets');

async function cropCherubs() {
  const inputPath = path.join(assetsDir, 'cherubs.png');

  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  console.log('Image size:', metadata.width, 'x', metadata.height);

  const width = metadata.width;
  const height = metadata.height;

  // Approximate positions for 3 cherubs evenly spaced
  const cherubWidth = Math.floor(width / 3);

  // Cherub 1 - Blue (left)
  await sharp(inputPath)
    .extract({ left: 0, top: 0, width: cherubWidth, height: height })
    .png()
    .toFile(path.join(assetsDir, 'cherub-blue.png'));
  console.log('Created cherub-blue.png');

  // Cherub 2 - Green (middle)
  await sharp(inputPath)
    .extract({ left: cherubWidth, top: 0, width: cherubWidth, height: height })
    .png()
    .toFile(path.join(assetsDir, 'cherub-green.png'));
  console.log('Created cherub-green.png');

  // Cherub 3 - Pink (right)
  await sharp(inputPath)
    .extract({ left: cherubWidth * 2, top: 0, width: width - (cherubWidth * 2), height: height })
    .png()
    .toFile(path.join(assetsDir, 'cherub-pink.png'));
  console.log('Created cherub-pink.png');

  console.log('Done!');
}

cropCherubs().catch(console.error);
