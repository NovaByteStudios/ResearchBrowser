const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("browserAPI", {
  navigate: (input) => {
    ipcRenderer.send("browser:navigate", input);
  },

  goBack: () => {
    ipcRenderer.send("browser:back");
  },

  goForward: () => {
    ipcRenderer.send("browser:forward");
  },

  reload: () => {
    ipcRenderer.send("browser:reload");
  },

  onPageUpdated: (callback) => {
    ipcRenderer.on("browser:page-updated", (_event, pageData) => {
      callback(pageData);
    });
  }
});