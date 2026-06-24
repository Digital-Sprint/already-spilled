// One-off: turn the solid black background of the new button JPEGs transparent.
// Flood-fills from the image borders through near-black pixels only, so the
// black hand-drawn box outlines/text (surrounded by color) are preserved.
const sharp = require("sharp");

async function removeBg(input, output, threshold = 80) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const N = width * height;
  const visited = new Uint8Array(N);
  const stack = [];
  const isBlack = (p) => {
    const o = p * channels;
    return data[o] < threshold && data[o + 1] < threshold && data[o + 2] < threshold;
  };
  const seed = (x, y) => {
    const p = y * width + x;
    if (!visited[p] && isBlack(p)) {
      visited[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    data[p * channels + 3] = 0; // make transparent
    const x = p % width;
    const y = (p - x) / width;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const np = ny * width + nx;
        if (!visited[np] && isBlack(np)) {
          visited[np] = 1;
          stack.push(np);
        }
      }
    }
  }
  const buf = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  await sharp(buf).trim({ threshold: 10 }).toFile(output);
  const m = await sharp(output).metadata();
  console.log(output, "->", m.width + "x" + m.height);
}

(async () => {
  await removeBg("_btn_story.jpeg", "public/assets/buttons/story-time.png");
  await removeBg("_btn_boletin.jpeg", "public/assets/buttons/el-boletin.png");
  await removeBg("_btn_spill.jpeg", "public/assets/buttons/spill-it.png");
})();
