const fs = require("fs");

function getImageAsBase64(path) {
  try {
    const data = fs.readFileSync(path);
    return `data:image/jpeg;base64,${data.toString("base64")}`;
  } catch (error) {
    console.error("Error reading image file:", error);
    return "";
  }
}

module.exports = getImageAsBase64;
