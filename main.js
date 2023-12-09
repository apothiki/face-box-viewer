const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const {
  checkPathExists,
  checkReadPermission,
  compareModels,
  getImageAsBase64,
  rebasePath,
} = require("./electron-src");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000/");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile("./build/index.html");
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Communication between main and renderer processes
if (isDev) {
  ipcMain.on("test-ipc", (event, arg) => {
    console.log(arg);
    event.reply("test-ipc-reply", "pong");
  });
}

ipcMain.on("compare-models", async (event, arg) => {
  const { model1CSV, model2CSV } = arg;
  let { model1Dir, model2Dir } = arg;

  if (
    !checkPathExists(model1CSV) ||
    !checkPathExists(model2CSV) ||
    !checkPathExists(model1Dir) ||
    !checkPathExists(model2Dir)
  ) {
    event.reply("comparison-error", "One or more paths do not exist.");
    return;
  }

  if (
    !checkReadPermission(model1CSV) ||
    !checkReadPermission(model2CSV) ||
    !checkReadPermission(model1Dir) ||
    !checkReadPermission(model2Dir)
  ) {
    event.reply(
      "comparison-error",
      "Insufficient permissions to read one or more paths."
    );
    return;
  }

  if (!fs.lstatSync(model1Dir).isDirectory()) {
    model1Dir = path.dirname(model1Dir);
  }
  if (!fs.lstatSync(model2Dir).isDirectory()) {
    model2Dir = path.dirname(model2Dir);
  }
  // get the parent directory of the first image path in csv as base directory
  const originalBaseDir = path.dirname(
    (() => {
      // assumes the first image directory has at least one image
      // and header is present
      // TODO: do not read the entire file into memory
      const records = fs.readFileSync(model1CSV, "utf8").split("\n");
      if (records.length < 2) return "";
      return records[1].split(",")[0];
    })()
  );
  // check if no base directory found
  if (originalBaseDir === ".") {
    event.reply("comparison-error", "No original base directory found.");
    return;
  }

  const differingImages = await compareModels(model1CSV, model2CSV);
  const results = differingImages.map((image) => ({
    original: image.image,
    model1Path: getImageAsBase64(
      rebasePath(image.image, originalBaseDir, model1Dir)
    ),
    model2Path: getImageAsBase64(
      rebasePath(image.image, originalBaseDir, model2Dir)
    ),
  }));
  event.reply("comparison-results", results);
});
