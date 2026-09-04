const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("browserAPI", {
  createTab: () => {

 ipcRenderer.send("tabs:create");

  },
  switchTab: (tabId) => {

 ipcRenderer.send("tabs:switch", tabId);

  },
  closeTab: (tabId) => {

 ipcRenderer.send("tabs:close", tabId);

  },
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
    ipcRenderer.on(
      "browser:page-updated",
      (_event, pageData) => {
        callback(pageData);
      }
    );
  },

  onLoadingChanged: (callback) => {
    ipcRenderer.on(
      "browser:loading-changed",
      (_event, isLoading) => {
        callback(isLoading);
      }
    );
  },
  onTabsUpdated: (callback) => {

  ipcRenderer.on("tabs:updated", (_event, tabData) => {

  callback(tabData);

  });

  },
  onFocusAddressBar: (callback) => {
    ipcRenderer.on("browser:focus-address-bar", () => {
      callback();
    });
  }
});