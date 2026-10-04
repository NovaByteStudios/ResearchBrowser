const {
  app,
  BrowserWindow,
  WebContentsView,
  ipcMain,
  Menu,
  session
} = require("electron");

const path = require("path");

const {
  initializeStorage,
  saveWorkspaceTabs,
  loadWorkspaceTabs,
  deleteWorkspaceData,
  getWorkspaceTabCount
} = require("./workspace-storage");

const {
  initializeSourceStorage,
  saveSource,
  loadSources,
  deleteSource,
  deleteWorkspaceSources
} = require("./source-storage");

const {
  initializeNoteStorage,
  loadNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteWorkspaceNotes
} = require("./note-storage");

let mainWindow = null;

const tabs = new Map();

let activeTabId = null;
let nextTabId = 1;
let activeWorkspace = null;
let currentScreen = "workspace";
let currentInternalPage = "browser";

const SIDEBAR_WIDTH = 220;
const TOP_AREA_HEIGHT = 101;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    title: "Research Browser",
    backgroundColor: "#0b0d12",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(
    path.join(__dirname, "workspace.html")
  );

  mainWindow.webContents.on(
    "did-finish-load",
    () => {
      if (currentScreen === "browser") {
        sendActiveWorkspace();
      }
    }
  );

  mainWindow.on("resize", () => {
    updateActiveTabBounds();
  });

  mainWindow.on("close", () => {
    saveActiveWorkspaceTabs();
  });

  mainWindow.on("closed", () => {
    closeAllTabs();

    mainWindow = null;
    activeTabId = null;
    activeWorkspace = null;
    currentScreen = "workspace";
    currentInternalPage = "browser";
  });
}

function createTab() {
  console.log(
    "createTab aufgerufen. Bildschirm:",
    currentScreen
  );

  if (
    currentScreen !== "browser" ||
    !activeWorkspace
  ) {
    console.error(
      "Tab blockiert. Kein aktiver Browser-Workspace.",
      currentScreen
    );

    return null;
  }

  const tabId = nextTabId;

  nextTabId += 1;

  const browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: getWorkspacePartition(
        activeWorkspace.id
      )
    }
  });

  browserView.setBackgroundColor("#0b0d12");

  const tab = {
    id: tabId,
    title: "Neuer Tab",
    url: "",
    isLoading: false,
    view: browserView
  };

  tabs.set(tabId, tab);

  registerTabEvents(tab);
  switchToTab(tabId);
  sendTabsUpdated();

  return tab;
}

function registerTabEvents(tab) {
  const webContents = tab.view.webContents;

  webContents.on("did-start-loading", () => {
    tab.isLoading = true;

    if (tab.id === activeTabId) {
      sendLoadingState(true);
    }

    sendTabsUpdated();
  });

  webContents.on("did-stop-loading", () => {
    tab.isLoading = false;

    updateTabInformation(tab);

    if (tab.id === activeTabId) {
      sendLoadingState(false);
      sendPageInformation(tab);
    }

    sendTabsUpdated();
  });

  webContents.on(
    "did-fail-load",
    (
      _event,
      errorCode,
      errorDescription
    ) => {
      tab.isLoading = false;

      if (tab.id === activeTabId) {
        sendLoadingState(false);
      }

      if (errorCode !== -3) {
        console.error(
          "Ladevorgang fehlgeschlagen:",
          errorCode,
          errorDescription
        );
      }

      sendTabsUpdated();
    }
  );

  webContents.on("did-navigate", () => {
    updateTabInformation(tab);

    if (tab.id === activeTabId) {
      sendPageInformation(tab);
    }

    sendTabsUpdated();
  });

  webContents.on(
    "did-navigate-in-page",
    () => {
      updateTabInformation(tab);

      if (tab.id === activeTabId) {
        sendPageInformation(tab);
      }

      sendTabsUpdated();
    }
  );

  webContents.on(
    "page-title-updated",
    (_event, title) => {
      tab.title = title || "Neuer Tab";

      if (tab.id === activeTabId) {
        sendPageInformation(tab);
      }

      sendTabsUpdated();
    }
  );

  webContents.setWindowOpenHandler(
    ({ url }) => {
      const newTab = createTab();

      if (newTab) {
        loadUrlInTab(newTab, url);
      }

      return {
        action: "deny"
      };
    }
  );
}

function updateTabInformation(tab) {
  if (!tab || tab.view.webContents.isDestroyed()) {
    return;
  }

  const webContents = tab.view.webContents;

  tab.url = webContents.getURL();
  tab.title =
    webContents.getTitle() || "Neuer Tab";
}

function switchToTab(tabId) {
  const numericTabId = Number(tabId);
  const nextTab = tabs.get(numericTabId);

  if (!mainWindow || !nextTab) {
    return;
  }

  const previousTab = tabs.get(activeTabId);

  if (previousTab) {
    mainWindow.contentView.removeChildView(
      previousTab.view
    );
  }

  activeTabId = numericTabId;

  if (
    nextTab.url !== "" &&
    currentInternalPage === "browser"
  ) {
    mainWindow.contentView.addChildView(
      nextTab.view
    );

  updateActiveTabBounds();
}

  sendTabsUpdated();
  sendPageInformation(nextTab);
  sendLoadingState(nextTab.isLoading);
}

function closeTab(tabId) {
  const numericTabId = Number(tabId);
  const tab = tabs.get(numericTabId);

  if (!tab) {
    return;
  }

  const wasActive = numericTabId === activeTabId;
  const tabIds = Array.from(tabs.keys());
  const closingIndex =
    tabIds.indexOf(numericTabId);

  if (mainWindow) {
    mainWindow.contentView.removeChildView(
      tab.view
    );
  }

  if (!tab.view.webContents.isDestroyed()) {
    tab.view.webContents.close();
  }

  tabs.delete(numericTabId);

  if (tabs.size === 0) {
    activeTabId = null;
    createTab();
    return;
  }

  if (wasActive) {
    const remainingTabIds =
      Array.from(tabs.keys());

    const nextIndex = Math.min(
      closingIndex,
      remainingTabIds.length - 1
    );

    switchToTab(
      remainingTabIds[nextIndex]
    );
  } else {
    sendTabsUpdated();
  }
}

function closeAllTabs() {
  for (const tab of tabs.values()) {
    if (mainWindow && tab.view) {
      mainWindow.contentView.removeChildView(tab.view);
    }

    if (
      tab.view &&
      !tab.view.webContents.isDestroyed()
    ) {
      tab.view.webContents.close();
    }
  }

  tabs.clear();
  activeTabId = null;
}

function saveActiveWorkspaceTabs() {
  if (!activeWorkspace || tabs.size === 0) {
    return;
  }

  const tabList = Array.from(tabs.values());

  const savedTabs = tabList.map((tab) => {
    return {
      title: tab.title || "Neuer Tab",
      url: tab.url || ""
    };
  });

  const activeTabIndex = tabList.findIndex(
    (tab) => tab.id === activeTabId
  );

  saveWorkspaceTabs(
    activeWorkspace.id,
    savedTabs,
    activeTabIndex >= 0 ? activeTabIndex : 0
  );

  console.log(
    "Tabs für Workspace gespeichert:",
    activeWorkspace.name,
    savedTabs.length
  );
}

function restoreActiveWorkspaceTabs() {
  if (!activeWorkspace) {
    return;
  }

  const workspaceState = loadWorkspaceTabs(
    activeWorkspace.id
  );

  const savedTabs = workspaceState.tabs;

  if (!Array.isArray(savedTabs) || savedTabs.length === 0) {
    createTab();
    return;
  }

  const restoredTabIds = [];

  for (const savedTab of savedTabs) {
    const restoredTab = createTab();

    if (!restoredTab) {
      continue;
    }

    restoredTab.title =
      savedTab.title || "Neuer Tab";

    restoredTabIds.push(restoredTab.id);

    if (
      savedTab.url &&
      String(savedTab.url).trim() !== ""
    ) {
      loadUrlInTab(
        restoredTab,
        String(savedTab.url)
      );
    }
  }

  if (restoredTabIds.length === 0) {
    createTab();
    return;
  }

  const savedActiveTabIndex =
    workspaceState.activeTabIndex;

  const validActiveTabIndex = Math.min(
    Math.max(savedActiveTabIndex, 0),
    restoredTabIds.length - 1
  );

  const restoredActiveTabId =
    restoredTabIds[validActiveTabIndex];

  switchToTab(restoredActiveTabId);

  console.log(
    "Tabs für Workspace wiederhergestellt:",
    activeWorkspace.name,
    restoredTabIds.length
  );
}

function updateActiveTabBounds() {
  if (
    !mainWindow ||
    activeTabId === null ||
    currentInternalPage !== "browser"
  ) {
    return;
  }

  const activeTab = tabs.get(activeTabId);

  if (!activeTab || activeTab.url === "") {
    return;
  }

  const [windowWidth, windowHeight] =
    mainWindow.getContentSize();

  activeTab.view.setBounds({
    x: SIDEBAR_WIDTH,
    y: TOP_AREA_HEIGHT,

    width: Math.max(
      0,
      windowWidth - SIDEBAR_WIDTH
    ),

    height: Math.max(
      0,
      windowHeight - TOP_AREA_HEIGHT
    )
  });
}

function showTabView(tab) {
  if (
    !mainWindow ||
    !tab ||
    currentInternalPage !== "browser"
  ) {
    return;
  }

  const currentChildren =
    mainWindow.contentView.children;

  if (!currentChildren.includes(tab.view)) {
    mainWindow.contentView.addChildView(
      tab.view
    );
  }

  updateActiveTabBounds();
}

function convertInputToUrl(input) {
  const cleanedInput =
    String(input).trim();

  if (cleanedInput === "") {
    return null;
  }

  if (
    cleanedInput.startsWith("http://") ||
    cleanedInput.startsWith("https://")
  ) {
    return cleanedInput;
  }

  const looksLikeWebsite =
    cleanedInput.includes(".") &&
    !cleanedInput.includes(" ");

  if (looksLikeWebsite) {
    return "https://" + cleanedInput;
  }

  const encodedSearch =
    encodeURIComponent(cleanedInput);

  return (
    "https://www.google.com/search?q=" +
    encodedSearch
  );
}

function loadUrlInTab(tab, url) {
  if (!tab || !url) {
    return;
  }

  tab.url = url;

  if (tab.id === activeTabId) {
    showTabView(tab);
  }

  console.log(
    "Tab",
    tab.id,
    "lädt:",
    url
  );

  tab.view.webContents
    .loadURL(url)
    .catch((error) => {
      tab.isLoading = false;

      if (tab.id === activeTabId) {
        sendLoadingState(false);
      }

      console.error(
        "Webseite konnte nicht geladen werden:",
        error
      );
    });
}

function sendActiveWorkspace() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  if (!activeWorkspace) {
    return;
  }

  mainWindow.webContents.send(
    "workspace:active",
    activeWorkspace
  );
}

function sendLoadingState(isLoading) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send(
    "browser:loading-changed",
    Boolean(isLoading)
  );
}

function sendPageInformation(tab) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  if (!tab) {
    return;
  }

  const webContents = tab.view.webContents;
  const hasPage =
    tab.url !== "" &&
    !webContents.isDestroyed();

  let canGoBack = false;
  let canGoForward = false;

  if (hasPage) {
    const navigationHistory =
      webContents.navigationHistory;

    canGoBack =
      navigationHistory.canGoBack();

    canGoForward =
      navigationHistory.canGoForward();
  }

  mainWindow.webContents.send(
    "browser:page-updated",
    {
      tabId: tab.id,
      title: tab.title,
      url: tab.url,
      hasPage,
      canGoBack,
      canGoForward
    }
  );
}

function sendTabsUpdated() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const tabList = Array.from(
    tabs.values()
  ).map((tab) => {
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      isLoading: tab.isLoading,
      isActive: tab.id === activeTabId
    };
  });

  mainWindow.webContents.send(
    "tabs:updated",
    {
      tabs: tabList,
      activeTabId
    }
  );
}

function getWorkspacePartition(workspaceId) {
  const safeWorkspaceId = String(workspaceId).replace(
    /[^a-zA-Z0-9_-]/g,
    "-"
  );
  return "persist:workspace-" + safeWorkspaceId;
}

ipcMain.handle(
  "workspace:delete-data",
  async (_event, workspaceId) => {
    if (!workspaceId) {
      return {
        success: false,
        error: "Keine Workspace-ID übergeben."
      };
    }

    const normalizedWorkspaceId = String(workspaceId);

    if (
      activeWorkspace &&
      activeWorkspace.id === normalizedWorkspaceId
    ) {
      return {
        success: false,
        error: "Der geöffnete Workspace kann nicht gelöscht werden."
      };
    }

    try {
      deleteWorkspaceData(
        normalizedWorkspaceId
      );
      deleteWorkspaceSources(
        normalizedWorkspaceId
      );
      deleteWorkspaceNotes(
        normalizedWorkspaceId
      );

      const workspaceSession = session.fromPartition(
        getWorkspacePartition(normalizedWorkspaceId)
      );

      await workspaceSession.clearStorageData();
      await workspaceSession.clearCache();
      await workspaceSession.clearAuthCache();

      console.log(
        "Workspace-Daten vollständig gelöscht:",
        normalizedWorkspaceId
      );

      return { success: true };
    } catch (error) {
      console.error(
        "Workspace-Daten konnten nicht gelöscht werden:",
        error
      );
      return {
        success: false,
        error: error.message || "Unbekannter Fehler beim Löschen."
      };
    }
  }
);

ipcMain.handle(
  "workspace:get-tab-count",
  (_event, workspaceId) => {
    if (!workspaceId) {
      return 0;
    }

    return getWorkspaceTabCount(
      String(workspaceId)
    );
  }
);

ipcMain.handle(
  "sources:save-current",
  () => {
    if (!activeWorkspace) {
      return {
        success: false,
        error: "Es ist kein Workspace geöffnet."
      };
    }

    const activeTab = tabs.get(activeTabId);

    if (
      !activeTab ||
      !activeTab.url ||
      activeTab.url.trim() === ""
    ) {
      return {
        success: false,
        error: "Es ist keine Webseite geöffnet."
      };
    }

    let domain = "";

    try {
      domain = new URL(activeTab.url).hostname;
    } catch (error) {
      console.error(
        "Domain konnte nicht ermittelt werden:",
        error
      );
    }

    return saveSource(
      activeWorkspace.id,
      {
        title:
          activeTab.title ||
          "Unbenannte Quelle",
        url: activeTab.url,
        domain
      }
    );
  }
);

ipcMain.handle(
  "sources:load",
  () => {
    if (!activeWorkspace) {
      return [];
    }

    return loadSources(
      activeWorkspace.id
    );
  }
);

ipcMain.handle(
  "sources:delete",
  (_event, sourceId) => {
    if (!activeWorkspace) {
      return {
        success: false,
        error: "Es ist kein Workspace geöffnet."
      };
    }

    if (!sourceId) {
      return {
        success: false,
        error: "Es wurde keine Quelle ausgewählt."
      };
    }

    return deleteSource(
      activeWorkspace.id,
      String(sourceId)
    );
  }
);

ipcMain.handle(
  "sources:open",
  (_event, sourceUrl) => {
    if (
      !activeWorkspace ||
      !sourceUrl
    ) {
      return {
        success: false,
        error: "Die Quelle kann nicht geöffnet werden."
      };
    }

    const normalizedUrl =
      String(sourceUrl).trim();

    if (normalizedUrl === "") {
      return {
        success: false,
        error: "Die Quelle besitzt keine gültige URL."
      };
    }

    let activeTab = tabs.get(activeTabId);

    if (!activeTab) {
      activeTab = createTab();
    }

    if (!activeTab) {
      return {
        success: false,
        error: "Es konnte kein Browser-Tab erstellt werden."
      };
    }

    currentInternalPage = "browser";

    loadUrlInTab(
      activeTab,
      normalizedUrl
    );

    return {
      success: true
    };
  }
);

ipcMain.handle(
  "notes:load",
  () => {
    if (!activeWorkspace) {
      return [];
    }

    return loadNotes(
      activeWorkspace.id
    );
  }
);

ipcMain.handle(
  "notes:create",
  (_event, noteData) => {
    if (!activeWorkspace) {
      return {
        success: false,
        error: "Es ist kein Workspace geöffnet."
      };
    }

    return createNote(
      activeWorkspace.id,
      noteData
    );
  }
);

ipcMain.handle(
  "notes:update",
  (_event, noteId, noteData) => {
    if (!activeWorkspace) {
      return {
        success: false,
        error: "Es ist kein Workspace geöffnet."
      };
    }

    return updateNote(
      activeWorkspace.id,
      noteId,
      noteData
    );
  }
);

ipcMain.handle(
  "notes:delete",
  (_event, noteId) => {
    if (!activeWorkspace) {
      return {
        success: false,
        error: "Es ist kein Workspace geöffnet."
      };
    }

    return deleteNote(
      activeWorkspace.id,
      noteId
    );
  }
);

ipcMain.on(
  "workspace:open",
  (_event, workspace) => {
    if (
      !workspace ||
      !workspace.id ||
      !workspace.name ||
      !mainWindow
    ) {
      return;
    }

    activeWorkspace = {
      id: String(workspace.id),
      name: String(workspace.name)
    };

    closeAllTabs();
    activeTabId = null;
    currentScreen = "browser";
    currentInternalPage = "browser";
    console.log(
      "Workspace geöffnet:",
      activeWorkspace.name,
      "Bildschirm:",
      currentScreen
    );

    mainWindow.loadFile(
      path.join(__dirname, "index.html")
    );
  }
);
ipcMain.on(
  "workspace:show-selection",
  () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    saveActiveWorkspaceTabs();
    closeAllTabs();

    activeTabId = null;
    activeWorkspace = null;
    currentScreen = "workspace";
    currentInternalPage = "browser";

    mainWindow.loadFile(
      path.join(__dirname, "workspace.html")
    );
  }
);
ipcMain.on(
  "browser:show-internal-page",
  (_event, pageName) => {
    if (
      !mainWindow ||
      mainWindow.isDestroyed()
    ) {
      return;
    }

    const allowedPages = [
      "browser",
      "sources",
      "notes"
    ];

    if (!allowedPages.includes(pageName)) {
      return;
    }

    currentInternalPage = pageName;

    const activeTab = tabs.get(activeTabId);

    if (
      pageName === "sources" ||
      pageName === "notes"
    ) {
      if (activeTab) {
        const currentChildren =
          mainWindow.contentView.children;

        if (
          currentChildren.includes(
            activeTab.view
          )
        ) {
          mainWindow.contentView.removeChildView(
            activeTab.view
          );
        }
      }

      return;
    }

    if (
      pageName === "browser" &&
      activeTab &&
      activeTab.url !== ""
    ) {
      showTabView(activeTab);
    }
  }
);
ipcMain.on("browser:ui-ready", () => {
  if (currentScreen !== "browser") {
    return;
  }

  if (tabs.size === 0) {
    restoreActiveWorkspaceTabs();
  } else {
    sendTabsUpdated();

    const activeTab = tabs.get(activeTabId);

    if (activeTab) {
      sendPageInformation(activeTab);
      sendLoadingState(activeTab.isLoading);
    }
  }

  sendActiveWorkspace();
});

ipcMain.on("tabs:create", () => {
  createTab();
});

ipcMain.on(
  "tabs:switch",
  (_event, tabId) => {
    switchToTab(tabId);
  }
);

ipcMain.on(
  "tabs:close",
  (_event, tabId) => {
    closeTab(tabId);
  }
);

ipcMain.on(
  "browser:navigate",
  (_event, input) => {
    let activeTab = tabs.get(activeTabId);

    if (!activeTab) {
      activeTab = createTab();
    }

    if (!activeTab) {
      return;
    }

    const url = convertInputToUrl(input);

    if (!url) {
      return;
    }

    loadUrlInTab(activeTab, url);
  }
);

ipcMain.on("browser:back", () => {
  const activeTab = tabs.get(activeTabId);

  if (!activeTab || activeTab.url === "") {
    return;
  }

  const navigationHistory =
    activeTab.view.webContents
      .navigationHistory;

  if (navigationHistory.canGoBack()) {
    navigationHistory.goBack();
  }
});

ipcMain.on("browser:forward", () => {
  const activeTab = tabs.get(activeTabId);

  if (!activeTab || activeTab.url === "") {
    return;
  }

  const navigationHistory =
    activeTab.view.webContents
      .navigationHistory;

  if (navigationHistory.canGoForward()) {
    navigationHistory.goForward();
  }
});

ipcMain.on("browser:reload", () => {
  const activeTab = tabs.get(activeTabId);

  if (activeTab && activeTab.url !== "") {
    activeTab.view.webContents.reload();
  }
});

function createApplicationMenu() {
  const template = [
    {
      label: "Research Browser",
      submenu: [
        {
          role: "about",
          label: "Über Research Browser"
        },
        {
          type: "separator"
        },
        {
          role: "hide",
          label: "Research Browser ausblenden"
        },
        {
          role: "hideOthers",
          label: "Andere ausblenden"
        },
        {
          role: "unhide",
          label: "Alle einblenden"
        },
        {
          type: "separator"
        },
        {
          role: "quit",
          label: "Research Browser beenden"
        }
      ]
    },
    {
      label: "Datei",
      submenu: [
        {
          label: "Neuer Tab",
          accelerator: "CommandOrControl+T",
          click: () => {
            createTab();
          }
        },
        {
          label: "Aktiven Tab schließen",
          accelerator: "CommandOrControl+W",
          click: () => {
            if (activeTabId !== null) {
              closeTab(activeTabId);
            }
          }
        }
      ]
    },
    {
      label: "Bearbeiten",
      submenu: [
        {
          role: "undo",
          label: "Widerrufen"
        },
        {
          role: "redo",
          label: "Wiederholen"
        },
        {
          type: "separator"
        },
        {
          role: "cut",
          label: "Ausschneiden"
        },
        {
          role: "copy",
          label: "Kopieren"
        },
        {
          role: "paste",
          label: "Einfügen"
        },
        {
          role: "selectAll",
          label: "Alles auswählen"
        }
      ]
    },
    {
      label: "Ansicht",
      submenu: [
        {
          label: "Adressleiste auswählen",
          accelerator: "CommandOrControl+L",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.focus();
              mainWindow.webContents.send(
                "browser:focus-address-bar"
              );
            }
          }
        },
        {
          label: "Seite neu laden",
          accelerator: "CommandOrControl+R",
          click: () => {
            const activeTab = tabs.get(activeTabId);

            if (activeTab && activeTab.url !== "") {
              activeTab.view.webContents.reload();
            }
          }
        },
        {
          type: "separator"
        },
        {
          role: "toggleDevTools",
          label: "Entwicklerwerkzeuge"
        },
        {
          role: "togglefullscreen",
          label: "Vollbild"
        }
      ]
    },
    {
      label: "Fenster",
      submenu: [
        {
          role: "minimize",
          label: "Minimieren"
        },
        {
          role: "zoom",
          label: "Zoomen"
        },
        {
          type: "separator"
        },
        {
          role: "front",
          label: "Alle nach vorne bringen"
        }
      ]
    }
  ];

  const applicationMenu =
    Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(applicationMenu);
}

app.whenReady().then(() => {
  initializeStorage(app.getPath("userData"));
  initializeSourceStorage(
    app.getPath("userData")
  );
  initializeNoteStorage(
    app.getPath("userData")
  );
  createMainWindow();
  createApplicationMenu();

  app.on("activate", () => {
    if (
      BrowserWindow.getAllWindows()
        .length === 0
    ) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});