const fs = require("fs");
const path = require("path");

let storageFilePath = null;

function createEmptyStorage() {
  return {
    version: 1,
    workspaces: {}
  };
}

function initializeNoteStorage(userDataPath) {
  storageFilePath = path.join(
    userDataPath,
    "note-data.json"
  );

  ensureStorageFile();

  console.log(
    "Notizspeicher:",
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
      "Notizen konnten nicht gelesen werden:",
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

  try {
    fs.writeFileSync(
      temporaryFilePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    fs.renameSync(
      temporaryFilePath,
      storageFilePath
    );
  } catch (error) {
    console.error(
      "Notizen konnten nicht gespeichert werden:",
      error
    );

    if (fs.existsSync(temporaryFilePath)) {
      fs.unlinkSync(temporaryFilePath);
    }

    throw error;
  }
}

function loadNotes(workspaceId) {
  if (!workspaceId) {
    return [];
  }

  const storage = readStorage();
  const workspaceNotes =
    storage.workspaces[String(workspaceId)];

  return Array.isArray(workspaceNotes)
    ? workspaceNotes
    : [];
}

function createNote(
  workspaceId,
  noteData
) {
  if (!workspaceId) {
    return {
      success: false,
      error: "Es ist kein Workspace geöffnet."
    };
  }

  const title =
    String(noteData?.title || "").trim();

  const content =
    String(noteData?.content || "").trim();

  const sourceId =
    noteData?.sourceId === null ||
    noteData?.sourceId === undefined ||
    String(noteData.sourceId).trim() === ""
      ? null
      : String(noteData.sourceId).trim();

  if (title === "" && content === "") {
    return {
      success: false,
      error:
        "Die Notiz benötigt einen Titel oder einen Inhalt."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  if (
    !Array.isArray(
      storage.workspaces[
        normalizedWorkspaceId
      ]
    )
  ) {
    storage.workspaces[
      normalizedWorkspaceId
    ] = [];
  }

  const timestamp = new Date().toISOString();

  const note = {
    id:
      "note-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8),

    title:
      title || "Unbenannte Notiz",

    content,
    sourceId,

    createdAt: timestamp,
    updatedAt: timestamp
  };

  storage.workspaces[
    normalizedWorkspaceId
  ].unshift(note);

  writeStorage(storage);

  return {
    success: true,
    note
  };
}

function updateNote(
  workspaceId,
  noteId,
  noteData
) {
  if (!workspaceId || !noteId) {
    return {
      success: false,
      error:
        "Workspace oder Notiz wurde nicht gefunden."
    };
  }

  const title =
    String(noteData?.title || "").trim();

  const content =
    String(noteData?.content || "").trim();

  const sourceId =
    noteData?.sourceId === null ||
    noteData?.sourceId === undefined ||
    String(noteData.sourceId).trim() === ""
      ? null
      : String(noteData.sourceId).trim();

  if (title === "" && content === "") {
    return {
      success: false,
      error:
        "Die Notiz benötigt einen Titel oder einen Inhalt."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  const workspaceNotes =
    storage.workspaces[
      normalizedWorkspaceId
    ];

  if (!Array.isArray(workspaceNotes)) {
    return {
      success: false,
      error: "Die Notiz wurde nicht gefunden."
    };
  }

  const note = workspaceNotes.find(
    (savedNote) =>
      savedNote.id === String(noteId)
  );

  if (!note) {
    return {
      success: false,
      error: "Die Notiz wurde nicht gefunden."
    };
  }

  note.title =
    title || "Unbenannte Notiz";

  note.content = content;
  note.sourceId = sourceId;
  note.updatedAt = new Date().toISOString();

  writeStorage(storage);

  return {
    success: true,
    note
  };
}

function deleteNote(
  workspaceId,
  noteId
) {
  if (!workspaceId || !noteId) {
    return {
      success: false,
      error:
        "Workspace oder Notiz wurde nicht gefunden."
    };
  }

  const storage = readStorage();
  const normalizedWorkspaceId =
    String(workspaceId);

  const workspaceNotes =
    storage.workspaces[
      normalizedWorkspaceId
    ];

  if (!Array.isArray(workspaceNotes)) {
    return {
      success: false,
      error: "Die Notiz wurde nicht gefunden."
    };
  }

  const remainingNotes =
    workspaceNotes.filter(
      (note) =>
        note.id !== String(noteId)
    );

  if (
    remainingNotes.length ===
    workspaceNotes.length
  ) {
    return {
      success: false,
      error: "Die Notiz wurde nicht gefunden."
    };
  }

  storage.workspaces[
    normalizedWorkspaceId
  ] = remainingNotes;

  writeStorage(storage);

  return {
    success: true
  };
}

function deleteWorkspaceNotes(workspaceId) {
  if (!workspaceId) {
    return false;
  }

  const storage = readStorage();

  delete storage.workspaces[
    String(workspaceId)
  ];

  writeStorage(storage);

  return true;
}

module.exports = {
  initializeNoteStorage,
  loadNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteWorkspaceNotes
};