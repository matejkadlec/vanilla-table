const fs = require("fs");
const path = require("path");
const packageJson = require("./package.json");

const files = [
  "src/core.js",
  "src/render.js",
  "src/sort.js",
  "src/filters.js",
  "src/pagination.js",
  "src/exports.js",
  "index.js",
];

const version = packageJson.version;
const outputDir = path.join(__dirname, "dist");
const outputFile = path.join(outputDir, `vanilla-table-${version}.js`);

// Ensure dist directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Concatenate files
let content = "";
files.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    content += fs.readFileSync(filePath, "utf8") + "\n\n";
  } else {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }
});

fs.writeFileSync(outputFile, content);
console.log(`Created ${outputFile}`);
