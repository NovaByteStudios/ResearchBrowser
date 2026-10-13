const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("browserAPI", {
  openWorkspace: (workspace) => {
    ipcRenderer.send("workspace:open", workspace);
  },

  deleteWorkspaceData: (workspaceId) => {
    return ipcRenderer.invoke(
      "workspace:delete-data",
      workspaceId
    );
  },

  getWorkspaceTabCount: (workspaceId) => {
    return ipcRenderer.invoke(
      "workspace:get-tab-count",
      workspaceId
    );
  },

  saveCurrentSource: () => {
  return ipcRenderer.invoke(
    "sources:save-current"
  );
},

loadSources: () => {
  return ipcRenderer.invoke(
    "sources:load"
  );
},

updateSourceTags: (
  sourceId,
  tags
) => {
  return ipcRenderer.invoke(
    "sources:update-tags",
    sourceId,
    tags
  );
},

deleteSource: (sourceId) => {
  return ipcRenderer.invoke(
    "sources:delete",
    sourceId
  );
},

openSource: (sourceUrl) => {
  return ipcRenderer.invoke(
    "sources:open",
    sourceUrl
  );
},

loadNotes: () => {
  return ipcRenderer.invoke(
    "notes:load"
  );
},

createNote: (noteData) => {
  return ipcRenderer.invoke(
    "notes:create",
    noteData
  );
},

updateNote: (
  noteId,
  noteData
) => {
  return ipcRenderer.invoke(
    "notes:update",
    noteId,
    noteData
  );
},

deleteNote: (noteId) => {
  return ipcRenderer.invoke(
    "notes:delete",
    noteId
  );
},

  showWorkspaceSelection: () => {
    ipcRenderer.send("workspace:show-selection");
  },

  showInternalPage: (pageName) => {
    ipcRenderer.send(
      "browser:show-internal-page",
      pageName
    );
  },

  browserReady: () => {
    ipcRenderer.send("browser:ui-ready");
  },

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
    ipcRenderer.on(
      "tabs:updated",
      (_event, tabData) => {
        callback(tabData);
      }
    );
  },

  onActiveWorkspaceChanged: (callback) => {
    ipcRenderer.on(
      "workspace:active",
      (_event, workspace) => {
        callback(workspace);
      }
    );
  },

  onFocusAddressBar: (callback) => {
    ipcRenderer.on(
      "browser:focus-address-bar",
      () => {
        callback();
      }
    );
  }
});
