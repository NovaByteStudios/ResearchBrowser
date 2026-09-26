const fs = require("fs");
const path = require("path");

let storageFilePath = null;

function createEmptyStorage() {
  return {
    version: 1,
    workspaces: {}
  };
}

function initializeStorage(userDataPath) {
  storageFilePath = path.join(
    userDataPath,
    "workspace-data.json"
  );
  ensureStorageFile();
  console.log("Workspace-Speicher:", storageFilePath);
}

function ensureStorageFile() {
  if (!storageFilePath || fs.existsSync(storageFilePath)) {
    return;
  }
  writeStorage(createEmptyStorage());
}

function readStorage() {
  if (!storageFilePath) {
    return createEmptyStorage();
  }
  ensureStorageFile();
  try {
    const fileContent = fs.readFileSync(storageFilePath, "utf8");
    const parsedData = JSON.parse(fileContent);
    if (
      !parsedData ||
      typeof parsedData !== "object" ||
      !parsedData.workspaces ||
      typeof parsedData.workspaces !== "object"
    ) {
      return createEmptyStorage();
    }
    return parsedData;
  } catch (error) {
    console.error("Workspace-Daten konnten nicht gelesen werden:", error);
    return createEmptyStorage();
  }
}

function writeStorage(data) {
  if (!storageFilePath) {
    return;
  }
  const temporaryFilePath = storageFilePath + ".temporary";
  fs.writeFileSync(
    temporaryFilePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
  fs.renameSync(temporaryFilePath, storageFilePath);
}

function saveWorkspaceTabs(workspaceId, savedTabs, activeTabIndex) {
  if (!workspaceId) {
    return;
  }
  const storage = readStorage();
  storage.workspaces[workspaceId] = {
    tabs: Array.isArray(savedTabs) ? savedTabs : [],
    activeTabIndex: Number.isInteger(activeTabIndex)
      ? activeTabIndex
      : 0,
    updatedAt: new Date().toISOString()
  };
  writeStorage(storage);
}

function loadWorkspaceTabs(workspaceId) {
  if (!workspaceId) {
    return { tabs: [], activeTabIndex: 0 };
  }
  const storage = readStorage();
  const workspaceData = storage.workspaces[workspaceId];
  if (!workspaceData) {
    return { tabs: [], activeTabIndex: 0 };
  }
  return {
    tabs: Array.isArray(workspaceData.tabs)
      ? workspaceData.tabs
      : [],
    activeTabIndex: Number.isInteger(workspaceData.activeTabIndex)
      ? workspaceData.activeTabIndex
      : 0
  };
}

function deleteWorkspaceData(workspaceId) {
  if (!workspaceId) {
    return false;
  }
  const storage = readStorage();
  if (!Object.prototype.hasOwnProperty.call(
    storage.workspaces,
    workspaceId
  )) {
    return true;
  }
  delete storage.workspaces[workspaceId];
  writeStorage(storage);
  return true;
}

function getWorkspaceTabCount(workspaceId) {
  if (!workspaceId) {
    return 0;
  }

  const workspaceState =
    loadWorkspaceTabs(workspaceId);

  return workspaceState.tabs.length;
}

module.exports = {
  initializeStorage,
  saveWorkspaceTabs,
  loadWorkspaceTabs,
  deleteWorkspaceData,
  getWorkspaceTabCount
};