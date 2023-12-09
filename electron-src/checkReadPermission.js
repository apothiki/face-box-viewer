const fs = require("fs");

function checkReadPermission(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = checkReadPermission;
