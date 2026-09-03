const {
  app,
  BrowserWindow,
  WebContentsView,
  ipcMain
} = require("electron");

const path = require("path");

let mainWindow = null;
let browserView = null;

const SIDEBAR_WIDTH = 220;
const TOP_AREA_HEIGHT = 98;

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

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("resize", () => {
    updateBrowserViewBounds();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    browserView = null;
  });
}

function createBrowserView() {
  if (!mainWindow || browserView) {
    return;
  }

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.contentView.addChildView(browserView);

  updateBrowserViewBounds();

  browserView.webContents.on("did-navigate", () => {
    sendPageInformation();
  });

  browserView.webContents.on("did-navigate-in-page", () => {
    sendPageInformation();
  });

  browserView.webContents.on("page-title-updated", () => {
    sendPageInformation();
  });

  browserView.webContents.on("did-finish-load", () => {
    sendPageInformation();
  });

  browserView.webContents.setWindowOpenHandler(({ url }) => {
    browserView.webContents.loadURL(url).catch((error) => {
      console.error("Neue Seite konnte nicht geladen werden:", error);
    });

    return {
      action: "deny"
    };
  });
}

function updateBrowserViewBounds() {
  if (!mainWindow || !browserView) {
    return;
  }

  const [windowWidth, windowHeight] = mainWindow.getContentSize();

  browserView.setBounds({
    x: SIDEBAR_WIDTH,
    y: TOP_AREA_HEIGHT,
    width: Math.max(0, windowWidth - SIDEBAR_WIDTH),
    height: Math.max(0, windowHeight - TOP_AREA_HEIGHT)
  });
}

function convertInputToUrl(input) {
  const cleanedInput = String(input).trim();

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

  const encodedSearch = encodeURIComponent(cleanedInput);

  return "https://www.google.com/search?q=" + encodedSearch;
}

function sendPageInformation() {
  if (!mainWindow || !browserView) {
    return;
  }

  if (mainWindow.isDestroyed()) {
    return;
  }

  const navigationHistory =
    browserView.webContents.navigationHistory;

  mainWindow.webContents.send("browser:page-updated", {
    title: browserView.webContents.getTitle(),
    url: browserView.webContents.getURL(),
    canGoBack: navigationHistory.canGoBack(),
    canGoForward: navigationHistory.canGoForward()
  });
}

ipcMain.on("browser:navigate", (_event, input) => {
  const url = convertInputToUrl(input);

  if (!url) {
    return;
  }

  console.log("Lade Webseite:", url);

  createBrowserView();

  browserView.webContents.loadURL(url).catch((error) => {
    console.error("Webseite konnte nicht geladen werden:", error);
  });
});

ipcMain.on("browser:back", () => {
  if (!browserView) {
    return;
  }

  const navigationHistory =
    browserView.webContents.navigationHistory;

  if (navigationHistory.canGoBack()) {
    navigationHistory.goBack();
  }
});

ipcMain.on("browser:forward", () => {
  if (!browserView) {
    return;
  }

  const navigationHistory =
    browserView.webContents.navigationHistory;

  if (navigationHistory.canGoForward()) {
    navigationHistory.goForward();
  }
});

ipcMain.on("browser:reload", () => {
  if (browserView) {
    browserView.webContents.reload();
  }
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});