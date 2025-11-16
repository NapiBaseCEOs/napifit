const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");

const svgMarkup = `
<svg width="1024" height="1024" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="napifit-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#napifit-gradient)" />
  <path d="M21 44V20h4.4l17.2 17.9V20h4.4v24h-4.4L25.4 26.1V44z" fill="#0f172a" opacity="0.95" />
  <g transform="translate(50,50)">
    <path d="M0 -2.5 L0.8 0 L0 2.5 L-0.8 0 Z M-2.5 0 L0 -0.8 L2.5 0 L0 0.8 Z" fill="#e2e8f0" opacity="0.75" />
  </g>
</svg>
`.trim();

const targets = [
  { size: 512, file: "public/icon-512.png" },
  { size: 192, file: "public/icon-192.png" },
  { size: 180, file: "public/apple-touch-icon.png" },
  { size: 512, file: "public/napifit-logo.png" },
  { size: 256, file: "src/app/icon.png" },
];

async function run() {
  const buffer = Buffer.from(svgMarkup);
  await Promise.all(
    targets.map((target) => {
      const dest = path.join(projectRoot, target.file);
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return sharp(buffer)
        .resize(target.size, target.size, { fit: "contain", background: { r: 5, g: 8, b: 23, alpha: 1 } })
        .png()
        .toFile(dest);
    })
  );

  fs.writeFileSync(path.join(projectRoot, "public/napifit-logo.svg"), svgMarkup, "utf8");
  console.log("✅ Generated logo assets");
}

run().catch((error) => {
  console.error("Failed to generate icons", error);
  process.exit(1);
});

