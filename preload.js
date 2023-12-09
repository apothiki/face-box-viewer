const { contextBridge, ipcRenderer } = require("electron/renderer");

const ping = () => ipcRenderer.send("test-ipc", "ping");
const onPingReply = (callback) => ipcRenderer.on("test-ipc-reply", callback);
const removePingListener = () =>
  ipcRenderer.removeAllListeners("test-ipc-reply");
const compareModels = ({ model1CSV, model2CSV, model1Dir, model2Dir }) =>
  ipcRenderer.send("compare-models", {
    model1CSV,
    model2CSV,
    model1Dir,
    model2Dir,
  });
const onCompareModelsReply = (callback) =>
  ipcRenderer.on("comparison-results", callback);
const removeCompareModelsListener = () => {
  ipcRenderer.removeAllListeners("comparison-results");
};
const onCompareModelsError = (callback) =>
  ipcRenderer.on("comparison-error", callback);

contextBridge.exposeInMainWorld("electronAPI", {
  ping,
  onPingReply,
  removePingListener,
  compareModels,
  onCompareModelsReply,
  onCompareModelsError,
  removeCompareModelsListener,
});
