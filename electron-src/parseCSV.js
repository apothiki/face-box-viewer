const fs = require("fs");
const Papa = require("papaparse");

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

module.exports = parseCSV;
