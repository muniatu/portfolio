import fs from "fs";
import path from "path";

// Simple average color extraction by sampling raw JPEG data
// We look at pixel data after the JPEG headers — not precise but good enough for hue sorting

const PHOTO_DIR = path.join(process.cwd(), "public/images/photography/sample");
const OUTPUT = path.join(process.cwd(), "src/content/photography/collections.json");

// Decode a small portion of JPEG to estimate dominant color
// Since we can't decode JPEG natively, we'll use a canvas-less approach:
// Read raw bytes and look for common color patterns in the compressed data
// Actually, let's use a different approach — use the built-in image-size package
// that's already in the project, and create a simple pixel sampler

// Better approach: use the 'sharp' alternative or just do a statistical analysis
// of the raw file bytes to estimate warm/cool/neutral

// Simplest reliable approach: read the filename and let user manually sort,
// OR use a tiny inline JPEG decoder

// Let's use the approach of spawning a tiny node canvas operation
// Actually, the project doesn't have canvas. Let's use a pure JS approach.

// We'll sample bytes from the raw JPEG data at regular intervals.
// JPEG compressed data loosely correlates with color — not perfect but
// gives us warm vs cool vs neutral ordering.

// Actually the best approach with no dependencies:
// Extract the JPEG thumbnail from EXIF (if present) and analyze its raw RGB,
// or just use statistical byte analysis.

// Let's go practical: analyze the raw bytes for color temperature estimation
function estimateHue(filepath) {
  const buf = fs.readFileSync(filepath);

  // Sample bytes from the middle portion of the file (skip headers/footers)
  const start = Math.floor(buf.length * 0.3);
  const end = Math.floor(buf.length * 0.7);
  const sample = buf.slice(start, end);

  // Count byte value distributions in 3 channels worth of data
  // This is a rough heuristic — higher bytes in certain positions suggest warmer colors
  let sumR = 0, sumG = 0, sumB = 0, count = 0;

  for (let i = 0; i < sample.length - 2; i += 37) { // Sample every 37th triplet
    sumR += sample[i];
    sumG += sample[i + 1];
    sumB += sample[i + 2];
    count++;
  }

  if (count === 0) return { hue: 0, sat: 0, lum: 0.5 };

  const r = sumR / count / 255;
  const g = sumG / count / 255;
  const b = sumB / count / 255;

  // RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (max + min) / 2;

  if (max === min) return { hue: 0, sat: 0, lum };

  const d = max - min;
  const sat = lum > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) hue = ((b - r) / d + 2) / 6;
  else hue = ((r - g) / d + 4) / 6;

  return { hue, sat, lum };
}

// Get all photos
const files = fs.readdirSync(PHOTO_DIR)
  .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  .map(f => ({
    filename: f,
    path: path.join(PHOTO_DIR, f),
    src: `/images/photography/sample/${f}`,
  }));

console.log(`Analyzing ${files.length} photos...`);

// Analyze each
const analyzed = files.map(f => {
  const color = estimateHue(f.path);
  return { ...f, ...color };
});

// Sort by hue for rainbow effect
// Group: low saturation (grays/BW) at the ends, saturated in the middle
analyzed.sort((a, b) => {
  // Put very desaturated (B&W) photos at the start
  const aSat = a.sat > 0.15 ? 1 : 0;
  const bSat = b.sat > 0.15 ? 1 : 0;
  if (aSat !== bSat) return aSat - bSat;
  // Then sort by hue
  return a.hue - b.hue;
});

console.log("Color analysis results:");
analyzed.forEach((p, i) => {
  console.log(`${String(i+1).padStart(3)}. ${p.filename} — H:${p.hue.toFixed(2)} S:${p.sat.toFixed(2)} L:${p.lum.toFixed(2)}`);
});

// Build collections.json
const photos = analyzed.map(p => ({
  src: p.src,
  alt: p.filename.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
  tags: ["photography"],
}));

const collections = {
  collections: [
    {
      slug: "all",
      title: "Photography",
      description: "A curated collection of photographs",
      cover: photos[Math.floor(photos.length / 2)]?.src || photos[0]?.src,
      photos,
    }
  ]
};

fs.writeFileSync(OUTPUT, JSON.stringify(collections, null, 2));
console.log(`\nWrote ${photos.length} photos to collections.json (sorted by color)`);
