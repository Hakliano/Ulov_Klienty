/**
 * Po buildu zminifikuje CSS a JS v _site/assets (přepíše soubory).
 * Spouští se jako: node scripts/minify-assets.js
 */
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "_site");
const ASSETS = path.join(SITE, "assets");

async function main() {
  try {
    const CleanCSS = require("clean-css");
    const { minify: minifyJS } = require("terser");
    const cleanCSS = new CleanCSS({ level: 1 });

    const cssDir = path.join(ASSETS, "css");
    if (fs.existsSync(cssDir)) {
      for (const name of ["main.css", "web-demos.css"]) {
        const cssPath = path.join(cssDir, name);
        if (!fs.existsSync(cssPath)) continue;
        const css = fs.readFileSync(cssPath, "utf8");
        const out = cleanCSS.minify(css);
        if (!out.errors.length) {
          fs.writeFileSync(cssPath, out.styles, "utf8");
          console.log("Minified " + name);
        }
      }
    }

    const jsDir = path.join(ASSETS, "js");
    if (fs.existsSync(jsDir)) {
      const files = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"));
      for (const file of files) {
        const jsPath = path.join(jsDir, file);
        const code = fs.readFileSync(jsPath, "utf8");
        const result = await minifyJS(code, { compress: { passes: 1 }, format: { comments: false } });
        if (result.code) {
          fs.writeFileSync(jsPath, result.code, "utf8");
          console.log("Minified " + file);
        }
      }
    }
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.warn("Minify skipped: install clean-css and terser (npm install --save-dev clean-css terser)");
    } else {
      throw err;
    }
  }
}

main();
