const path = require("path");

function rebasePath(imagePath, originalBaseDir, newBaseDir) {
  // strip the original base directory from the image path
  const relativePath = path.relative(originalBaseDir, imagePath);
  // rebase with new base directory
  const rebasedPath = path.join(newBaseDir, relativePath);
  return rebasedPath;
}

module.exports = rebasePath;
