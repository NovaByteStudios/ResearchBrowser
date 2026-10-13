const fs = require("fs");
const path = require("path");
const { normalizeTags } = require("./tag-utils");

let storageFilePath = null;

function createEmptyStorage() {
  return {
    version: 1,
    workspaces: {}
  };
}

function initializeSourceStorage(userDataPath) {
  storageFilePath = path.join(
    userDataPath,
    "source-data.json"
  );

  ensureStorageFile();

  console.log(
    "Quellenspeicher:",
    storageFilePath
  );
}

function ensureStorageFile() {
  if (
    !storageFilePath ||
    fs.existsSync(storageFilePath)
  ) {
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
    const fileContent = fs.readFileSync(
      storageFilePath,
      "utf8"
    );

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
    console.error(
      "Quellen konnten nicht gelesen werden:",
      error
    );

    return createEmptyStorage();
  }
}

function writeStorage(data) {
  if (!storageFilePath) {
    return;
  }

  const temporaryFilePath =
    storageFilePath + ".temporary";

  fs.writeFileSync(
    temporaryFilePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  fs.renameSync(
    temporaryFilePath,
    storageFilePath
  );
}

function saveSource(workspaceId, source) {
  if (!workspaceId || !source || !source.url) {
    return {
      success: false,
      error: "Die Quelle enthält keine gültige URL."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  if (
    !Array.isArray(
      storage.workspaces[normalizedWorkspaceId]
    )
  ) {
    storage.workspaces[normalizedWorkspaceId] = [];
  }

  const workspaceSources =
    storage.workspaces[normalizedWorkspaceId];

  const existingSource = workspaceSources.find(
    (savedSource) =>
      savedSource.url === source.url
  );

  if (existingSource) {
    return {
      success: false,
      duplicate: true,
      error: "Diese Webseite ist bereits als Quelle gespeichert."
    };
  }

const savedSource = {
  id:
    "source-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2, 8),
  title: source.title || "Unbenannte Quelle",
  url: String(source.url),
  domain: source.domain || "",
  tags: normalizeTags(source.tags),
  savedAt: new Date().toISOString()
};

  workspaceSources.unshift(savedSource);

  writeStorage(storage);

  return {
    success: true,
    source: savedSource
  };
}

function loadSources(workspaceId) {
  if (!workspaceId) {
    return [];
  }

  const storage = readStorage();
  const workspaceSources =
    storage.workspaces[String(workspaceId)];

  if (!Array.isArray(workspaceSources)) {
    return [];
  }

  return workspaceSources.map((source) => {
    return {
      ...source,
      tags: normalizeTags(source.tags)
    };
  });
}

function updateSourceTags(
  workspaceId,
  sourceId,
  tags
) {
  if (!workspaceId || !sourceId) {
    return {
      success: false,
      error:
        "Workspace oder Quelle wurde nicht gefunden."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  const workspaceSources =
    storage.workspaces[
      normalizedWorkspaceId
    ];

  if (!Array.isArray(workspaceSources)) {
    return {
      success: false,
      error:
        "Für diesen Workspace wurden keine Quellen gefunden."
    };
  }

  const source = workspaceSources.find(
    (savedSource) =>
      String(savedSource.id) ===
      String(sourceId)
  );

  if (!source) {
    return {
      success: false,
      error:
        "Die Quelle wurde nicht gefunden."
    };
  }

  source.tags = normalizeTags(tags);

  writeStorage(storage);

  return {
    success: true,
    source
  };
}

function deleteSource(workspaceId, sourceId) {
  if (!workspaceId || !sourceId) {
    return {
      success: false,
      error: "Workspace oder Quelle fehlt."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  const workspaceSources =
    storage.workspaces[normalizedWorkspaceId];

  if (!Array.isArray(workspaceSources)) {
    return {
      success: false,
      error: "Die Quelle wurde nicht gefunden."
    };
  }

  const remainingSources =
    workspaceSources.filter(
      (source) => source.id !== sourceId
    );

  if (
    remainingSources.length ===
    workspaceSources.length
  ) {
    return {
      success: false,
      error: "Die Quelle wurde nicht gefunden."
    };
  }

  storage.workspaces[normalizedWorkspaceId] =
    remainingSources;

  writeStorage(storage);

  return {
    success: true
  };
}

function deleteWorkspaceSources(workspaceId) {
  if (!workspaceId) {
    return false;
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  delete storage.workspaces[
    normalizedWorkspaceId
  ];

  writeStorage(storage);

  return true;
}

module.exports = {
  initializeSourceStorage,
  saveSource,
  loadSources,
  updateSourceTags,
  deleteSource,
  deleteWorkspaceSources
};