const parseCSV = require("./parseCSV");

async function compareModels(model1CSV, model2CSV) {
  try {
    // TODO: do not read the entire file into memory
    const dataModel1 = await parseCSV(model1CSV);
    const dataModel2 = await parseCSV(model2CSV);

    // Assuming the structure is similar and indexed by image names
    return dataModel1.filter((imageData) => {
      if (imageData.image === "total") return false;
      const correspondingDataModel2 = dataModel2.find(
        (item) => item.image === imageData.image
      );
      return imageData.true_positive !== correspondingDataModel2.true_positive;
    });
  } catch (error) {
    console.error("Error in comparing models:", error);
  }
}

module.exports = compareModels;
