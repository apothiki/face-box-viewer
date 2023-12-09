const path = require("path");
const builder = require("electron-builder");
require("dotenv").config();

builder
  .build({
    projectDir: path.resolve(__dirname),
    publish: "always",
    win: ["portable", "nsis"],
    config: {
      appId: "io.github.chuuhsianghung.face-box-viewer",
      productName: "Face Bounding Box Viewer",
      copyright: `Copyright © ${new Date().getFullYear()} Chuu-Hsiang Hung`,
      directories: {
        output: "electron-build/win",
      },
      win: {
        publish: ["github"],
        icon: path.resolve(__dirname, "icon.png"),
      },
      files: [
        "build/**/*",
        "node_modules/**/*",
        "package.json",
        "main.js",
        "preload.js",
        "electron-src/**/*",
      ],
      extends: null, // so electron-builder won't look for public/electron.js
    },
  })
  .then(
    (data) => console.log(data),
    (err) => console.error(err)
  );
