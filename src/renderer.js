const addressBar =
  document.querySelector(".address-bar");

const startSearchInput =
  document.querySelector(".search-box input");

const backButton =
  document.querySelector('[data-action="back"]');

const forwardButton =
  document.querySelector('[data-action="forward"]');

const reloadButton =
  document.querySelector('[data-action="reload"]');

const loadingBar =
  document.querySelector(".loading-bar");

const tabsContainer =
  document.querySelector("#tabs-container");

const newTabButton =
  document.querySelector("#new-tab-button");
const saveSourceButton =
  document.querySelector(
    ".save-source-button"
  );
const showWorkspacesButton =
  document.querySelector("#show-workspaces-button");
const showSourcesButton =
  document.querySelector(
    "#show-sources-button"
  );

const returnToBrowserButton =
  document.querySelector(
    "#return-to-browser-button"
  );

const browserSidebarButton =
  document.querySelector(
    ".sidebar-navigation .sidebar-button"
  );

const startPage =
  document.querySelector(".start-page");

const sourcesPage =
  document.querySelector("#sources-page");

const sourcesEmptyState =
  document.querySelector(
    "#sources-empty-state"
  );

const sourcesList =
  document.querySelector(
    "#sources-list"
  );
const showNotesButton = document.querySelector("#show-notes-button");
const notesPage = document.querySelector("#notes-page");
const notesEmptyState = document.querySelector("#notes-empty-state");
const notesList = document.querySelector("#notes-list");
const noteEditor = document.querySelector("#note-editor");
const noteEditorHeading = document.querySelector("#note-editor-heading");
const noteForm = document.querySelector("#note-form");
const noteIdInput = document.querySelector("#note-id");
const noteTitleInput = document.querySelector("#note-title");
const noteSourceSelect = document.querySelector("#note-source");
const noteTagsInput = document.querySelector("#note-tags");
const noteContentInput = document.querySelector("#note-content");
const noteFormError = document.querySelector("#note-form-error");
const newNoteButton = document.querySelector("#new-note-button");
const createFirstNoteButton = document.querySelector("#create-first-note-button");
const closeNoteEditorButton = document.querySelector("#close-note-editor-button");
const cancelNoteButton = document.querySelector("#cancel-note-button");
const returnToBrowserFromNotesButton = document.querySelector("#return-to-browser-from-notes-button");

let activeTabId = null;
let availableNoteSources = [];
const activeWorkspaceName =
  document.querySelector(".workspace-name strong");
const savedActiveWorkspace =
  localStorage.getItem(
    "research-browser-active-workspace"
  );

if (savedActiveWorkspace) {
  try {
    const activeWorkspace =
      JSON.parse(savedActiveWorkspace);

    if (
      activeWorkspace &&
      activeWorkspace.name &&
      activeWorkspaceName
    ) {
      activeWorkspaceName.textContent =
        activeWorkspace.name;
    }
  } catch (error) {
    console.error(
      "Aktiver Workspace konnte nicht gelesen werden:",
      error
    );
  }
}
function formatSourceDate(savedAt) {
  if (!savedAt) {
    return "Unbekanntes Datum";
  }

  const savedDate = new Date(savedAt);

  if (Number.isNaN(savedDate.getTime())) {
    return "Unbekanntes Datum";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(savedDate);
}
async function openSavedSource(source) {
  try {
    const result =
      await window.browserAPI.openSource(
        source.url
      );

    if (!result || !result.success) {
      const errorMessage =
        result && result.error
          ? result.error
          : "Die Quelle konnte nicht geöffnet werden.";

      window.alert(errorMessage);
      return;
    }

    showBrowserPage();
  } catch (error) {
    console.error(
      "Quelle konnte nicht geöffnet werden:",
      error
    );

    window.alert(
      "Beim Öffnen der Quelle ist ein Fehler aufgetreten."
    );
  }
}
async function removeSavedSource(source) {
  const shouldDelete = window.confirm(
    `Quelle „${source.title}“ wirklich löschen?`
  );

  if (!shouldDelete) {
    return;
  }

  try {
    const result =
      await window.browserAPI.deleteSource(
        source.id
      );

    if (!result || !result.success) {
      const errorMessage =
        result && result.error
          ? result.error
          : "Die Quelle konnte nicht gelöscht werden.";

      window.alert(errorMessage);
      return;
    }

    await renderSources();
  } catch (error) {
    console.error(
      "Quelle konnte nicht gelöscht werden:",
      error
    );

    window.alert(
      "Beim Löschen der Quelle ist ein Fehler aufgetreten."
    );
  }
}
function createSourceCard(source) {
  const sourceCard =
    document.createElement("article");

  sourceCard.className = "source-card";

  const information =
    document.createElement("div");

  information.className =
    "source-card-information";

  const domain =
    document.createElement("span");

  domain.className = "source-domain";
  domain.textContent =
    source.domain || "Unbekannte Website";

  const title =
    document.createElement("h2");

  title.className = "source-title";
  title.textContent =
    source.title || "Unbenannte Quelle";

  const url =
    document.createElement("p");

  url.className = "source-url";
  url.textContent = source.url || "";
  url.title = source.url || "";

  const savedDate =
    document.createElement("span");

  savedDate.className = "source-saved-date";
  savedDate.textContent =
    "Gespeichert am " +
    formatSourceDate(source.savedAt);

  information.append(
    domain,
    title,
    url,
    savedDate
  );

  const actions =
    document.createElement("div");

  actions.className = "source-card-actions";

  const openButton =
    document.createElement("button");

  openButton.className =
    "source-action-button source-open-button";

  openButton.type = "button";
  openButton.textContent = "Öffnen";

  openButton.addEventListener(
    "click",
    () => {
      openSavedSource(source);
    }
  );

  const createNoteButton =
    document.createElement("button");

  createNoteButton.className =
    "source-action-button source-note-button";

  createNoteButton.type = "button";
  createNoteButton.textContent = "Notiz erstellen";

  createNoteButton.addEventListener(
    "click",
    async () => {
      showNotesPage();
      await openNoteEditor(null, source.id);
    }
  );

  const deleteButton =
    document.createElement("button");

  deleteButton.className =
    "source-action-button source-delete-button";

  deleteButton.type = "button";
  deleteButton.textContent = "Löschen";

  deleteButton.addEventListener(
    "click",
    () => {
      removeSavedSource(source);
    }
  );

  actions.append(
    openButton,
    createNoteButton,
    deleteButton
  );

  sourceCard.append(
    information,
    actions
  );

  return sourceCard;
}
async function renderSources() {
  sourcesList.replaceChildren();

  try {
    const sources =
      await window.browserAPI.loadSources();

    if (
      !Array.isArray(sources) ||
      sources.length === 0
    ) {
      sourcesEmptyState.classList.remove(
        "hidden"
      );

      return;
    }

    sourcesEmptyState.classList.add(
      "hidden"
    );

    for (const source of sources) {
      const sourceCard =
        createSourceCard(source);

      sourcesList.appendChild(
        sourceCard
      );
    }
  } catch (error) {
    console.error(
      "Quellen konnten nicht geladen werden:",
      error
    );

    sourcesEmptyState.classList.remove(
      "hidden"
    );

    window.alert(
      "Die gespeicherten Quellen konnten nicht geladen werden."
    );
  }
}
function updateSidebarSelection(
  activeButton
) {
  const sidebarButtons =
    document.querySelectorAll(
      ".sidebar-navigation .sidebar-button"
    );

  for (const button of sidebarButtons) {
    button.classList.toggle(
      "active",
      button === activeButton
    );
  }
}

function showSourcesPage() {
  startPage.classList.add("hidden");
  notesPage.classList.add("hidden");
  closeNoteEditor();
  sourcesPage.classList.remove("hidden");

  updateSidebarSelection(
    showSourcesButton
  );

  window.browserAPI.showInternalPage(
    "sources"
  );
  renderSources();
}

function showBrowserPage() {
  sourcesPage.classList.add("hidden");
  notesPage.classList.add("hidden");
  closeNoteEditor();

  updateSidebarSelection(
    browserSidebarButton
  );

  window.browserAPI.showInternalPage(
    "browser"
  );

  const activeTabHasPage =
    addressBar.value.trim() !== "";

  startPage.classList.toggle(
    "hidden",
    activeTabHasPage
  );
}

function getNotesStorageKey() {
  const name = activeWorkspaceName ? activeWorkspaceName.textContent.trim() : "default";
  return "research-browser-notes:" + name;
}

async function loadNotes() {
  if (window.browserAPI && typeof window.browserAPI.loadNotes === "function") {
    const result = await window.browserAPI.loadNotes();
    return Array.isArray(result) ? result : [];
  }
  try {
    const value = localStorage.getItem(getNotesStorageKey());
    const notes = value ? JSON.parse(value) : [];
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error("Notizen konnten nicht gelesen werden:", error);
    return [];
  }
}

function persistNotes(notes) {
  localStorage.setItem(getNotesStorageKey(), JSON.stringify(notes));
}

function closeNoteEditor() {
  if (!noteEditor) return;
  noteEditor.classList.add("hidden");
  noteForm.reset();
  noteIdInput.value = "";
  noteFormError.textContent = "";
  noteFormError.classList.add("hidden");
}

async function loadNoteSourceOptions(selectedSourceId = "") {
  noteSourceSelect.replaceChildren();

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Keine Quelle verknüpfen";
  noteSourceSelect.appendChild(emptyOption);

  try {
    availableNoteSources = await window.browserAPI.loadSources();
    if (!Array.isArray(availableNoteSources)) {
      availableNoteSources = [];
    }
  } catch (error) {
    console.error("Quellen für Notizen konnten nicht geladen werden:", error);
    availableNoteSources = [];
  }

  availableNoteSources.forEach((source) => {
    const option = document.createElement("option");
    option.value = String(source.id);
    option.textContent = source.title || source.domain || source.url || "Unbenannte Quelle";
    noteSourceSelect.appendChild(option);
  });

  noteSourceSelect.value = selectedSourceId ? String(selectedSourceId) : "";
}

async function openNoteEditor(note = null, preferredSourceId = "") {
  noteForm.reset();
  noteFormError.classList.add("hidden");
  noteFormError.textContent = "";

  const selectedSourceId = note && note.sourceId
    ? note.sourceId
    : preferredSourceId;
  await loadNoteSourceOptions(selectedSourceId);

  if (note) {
    noteEditorHeading.textContent = "Notiz bearbeiten";
    noteIdInput.value = note.id;
    noteTitleInput.value = note.title || "";
    noteTagsInput.value = Array.isArray(note.tags)
      ? note.tags.join(", ")
      : "";
    noteContentInput.value = note.content || "";
  } else {
    noteEditorHeading.textContent = "Neue Notiz";
    noteIdInput.value = "";
  }
  noteEditor.classList.remove("hidden");
  noteTitleInput.focus();
}

function formatNoteDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unbekanntes Datum" :
    new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

async function deleteNote(note) {
  if (!window.confirm(`Notiz „${note.title || "Ohne Titel"}“ wirklich löschen?`)) return;
  if (window.browserAPI && typeof window.browserAPI.deleteNote === "function") {
    const result = await window.browserAPI.deleteNote(note.id);
    if (result && result.success === false) throw new Error(result.error || "Löschen fehlgeschlagen");
  } else {
    persistNotes((await loadNotes()).filter((item) => item.id !== note.id));
  }
  await renderNotes();
}

function createNoteCard(note) {
  const card = document.createElement("article");
  card.className = "note-card";
  const info = document.createElement("div");
  info.className = "note-card-information";
  const title = document.createElement("h2");
  title.className = "note-title";
  title.textContent = note.title || "Ohne Titel";
  const preview = document.createElement("p");
  preview.className = "note-preview";
  preview.textContent = note.content || "";
  const tagsContainer = document.createElement("div");
tagsContainer.className = "note-tags";

const noteTags = Array.isArray(note.tags)
  ? note.tags
  : [];

for (const tag of noteTags) {
  const tagElement =
    document.createElement("span");

  tagElement.className = "note-tag";
  tagElement.textContent = tag;

  tagsContainer.appendChild(tagElement);
}

tagsContainer.classList.toggle(
  "hidden",
  noteTags.length === 0
);

  const linkedSource = note.sourceId
    ? availableNoteSources.find((source) => String(source.id) === String(note.sourceId))
    : null;

  if (note.sourceId) {
    const sourceBox = document.createElement("div");
    sourceBox.className = "note-linked-source";
    const sourceLabel = document.createElement("span");
    sourceLabel.className = "note-linked-source-label";
    sourceLabel.textContent = linkedSource
      ? "Quelle: " + (linkedSource.title || linkedSource.domain || linkedSource.url)
      : "Verknüpfte Quelle ist nicht mehr verfügbar";
    sourceBox.appendChild(sourceLabel);

    if (linkedSource && linkedSource.url) {
      const openSourceButton = document.createElement("button");
      openSourceButton.type = "button";
      openSourceButton.className = "note-source-open-button";
      openSourceButton.textContent = "Quelle öffnen";
      openSourceButton.addEventListener("click", async () => {
        const result = await window.browserAPI.openSource(linkedSource.url);
        if (result && result.success) {
          showBrowserPage();
        } else {
          window.alert(result?.error || "Die Quelle konnte nicht geöffnet werden.");
        }
      });
      sourceBox.appendChild(openSourceButton);
    }
    info.appendChild(sourceBox);
  }

  const date = document.createElement("span");
  date.className = "note-updated-date";
  date.textContent = "Bearbeitet am " + formatNoteDate(note.updatedAt || note.createdAt);
  info.append(
    title,
    preview,
    tagsContainer,
    date
  );
  const actions = document.createElement("div");
  actions.className = "note-card-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "note-action-button note-edit-button";
  edit.textContent = "Bearbeiten";
  edit.addEventListener("click", () => openNoteEditor(note));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "note-action-button note-delete-button";
  remove.textContent = "Löschen";
  remove.addEventListener("click", () => deleteNote(note).catch((error) => {
    console.error(error);
    window.alert("Die Notiz konnte nicht gelöscht werden.");
  }));
  actions.append(edit, remove);
  card.append(info, actions);
  return card;
}
async function renderNotes() {
  notesList.replaceChildren();
  try {
    availableNoteSources = await window.browserAPI.loadSources();
    if (!Array.isArray(availableNoteSources)) {
      availableNoteSources = [];
    }
  } catch (error) {
    console.error("Quellen für Notizkarten konnten nicht geladen werden:", error);
    availableNoteSources = [];
  }
  const notes = await loadNotes();
  notesEmptyState.classList.toggle("hidden", notes.length > 0);
  notes.slice().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .forEach((note) => notesList.appendChild(createNoteCard(note)));
}

function showNotesPage() {
  startPage.classList.add("hidden");
  sourcesPage.classList.add("hidden");
  notesPage.classList.remove("hidden");
  updateSidebarSelection(showNotesButton);
  window.browserAPI.showInternalPage("notes");
  renderNotes().catch(console.error);
}

async function saveNote(event) {
  event.preventDefault();
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  const sourceId = noteSourceSelect.value || null;
  const tags = noteTagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
  if (!title || !content) {
    noteFormError.textContent = "Bitte gib einen Titel und einen Inhalt ein.";
    noteFormError.classList.remove("hidden");
    return;
  }
  const id = noteIdInput.value;
  const now = new Date().toISOString();
  try {
    if (
      window.browserAPI &&
      typeof window.browserAPI.createNote === "function" &&
      typeof window.browserAPI.updateNote === "function"
    ) {
      const result = id
        ? await window.browserAPI.updateNote(id, { title, content, sourceId, tags })
        : await window.browserAPI.createNote({ title, content, sourceId, tags });

      if (!result || result.success === false) {
        throw new Error(
          result && result.error
            ? result.error
            : "Speichern fehlgeschlagen"
        );
      }
    } else {
      const notes = await loadNotes();
      const index = notes.findIndex((note) => note.id === id);
      if (index >= 0) {
        notes[index] = { ...notes[index], title, content, sourceId, tags, updatedAt: now };
      } else {
        notes.push({
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          title,
          content,
          sourceId,
          tags,
          createdAt: now,
          updatedAt: now
        });
      }
      persistNotes(notes);
    }
    closeNoteEditor();
    await renderNotes();
  } catch (error) {
    console.error(error);
    noteFormError.textContent = "Die Notiz konnte nicht gespeichert werden.";
    noteFormError.classList.remove("hidden");
  }
}

function navigate(input) {
  const cleanedInput = input.trim();

  if (cleanedInput === "") {
    return;
  }

  window.browserAPI.navigate(cleanedInput);
}

async function saveCurrentSource() {
  saveSourceButton.disabled = true;
  saveSourceButton.textContent =
    "Wird gespeichert...";

  try {
    const result =
      await window.browserAPI.saveCurrentSource();

    if (!result || !result.success) {
      const errorMessage =
        result && result.error
          ? result.error
          : "Die Quelle konnte nicht gespeichert werden.";

      window.alert(errorMessage);
      return;
    }

    window.alert(
      "Die Webseite wurde als Quelle gespeichert."
    );
    if (
      !sourcesPage.classList.contains(
        "hidden"
      )
    ) {
      await renderSources();
    }
  } catch (error) {
    console.error(
      "Quelle konnte nicht gespeichert werden:",
      error
    );

    window.alert(
      "Beim Speichern der Quelle ist ein Fehler aufgetreten."
    );
  } finally {
    saveSourceButton.disabled = false;
    saveSourceButton.textContent =
      "Quelle speichern";
  }
}

function createTabElement(tab) {
  const tabElement =
    document.createElement("div");

  tabElement.className = "tab";
  tabElement.dataset.tabId = tab.id;
  tabElement.setAttribute("role", "tab");

  if (tab.isActive) {
    tabElement.classList.add("active");
    tabElement.setAttribute(
      "aria-selected",
      "true"
    );
  } else {
    tabElement.setAttribute(
      "aria-selected",
      "false"
    );
  }

  const tabIcon =
    document.createElement("span");

  tabIcon.className = "tab-icon";

  if (tab.isLoading) {
    tabIcon.textContent = "↻";
    tabIcon.classList.add("loading");
  } else if (tab.url === "") {
    tabIcon.textContent = "⌂";
  } else {
    tabIcon.textContent = "◉";
  }

  const tabTitle =
    document.createElement("span");

  tabTitle.className = "tab-title";
  tabTitle.textContent =
    tab.title || "Neuer Tab";

  const closeButton =
    document.createElement("button");

  closeButton.className = "tab-close";
  closeButton.type = "button";
  closeButton.textContent = "×";
  closeButton.title = "Tab schließen";

  closeButton.setAttribute(
    "aria-label",
    "Tab schließen"
  );

  tabElement.appendChild(tabIcon);
  tabElement.appendChild(tabTitle);
  tabElement.appendChild(closeButton);

  tabElement.addEventListener(
    "click",
    () => {
      window.browserAPI.switchTab(tab.id);
    }
  );

  closeButton.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      window.browserAPI.closeTab(tab.id);
    }
  );

  return tabElement;
}

function renderTabs(tabData) {
  activeTabId = tabData.activeTabId;

  tabsContainer.replaceChildren();

  for (const tab of tabData.tabs) {
    const tabElement =
      createTabElement(tab);

    tabsContainer.appendChild(tabElement);
  }

  const activeTabElement =
    tabsContainer.querySelector(".tab.active");

  if (activeTabElement) {
    activeTabElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }
}

addressBar.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      navigate(addressBar.value);
      return;
    }

    if (
      event.metaKey &&
      !event.shiftKey &&
      event.key.toLowerCase() === "z"
    ) {
      event.preventDefault();
      document.execCommand("undo");
    }

    if (
      event.metaKey &&
      event.shiftKey &&
      event.key.toLowerCase() === "z"
    ) {
      event.preventDefault();
      document.execCommand("redo");
    }
  }
);

addressBar.addEventListener(
  "focus",
  () => {
    addressBar.select();
  }
);

startSearchInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      const input =
        startSearchInput.value.trim();

      if (input === "") {
        return;
      }

      addressBar.value = input;
      navigate(input);
    }
  }
);

backButton.addEventListener(
  "click",
  () => {
    window.browserAPI.goBack();
  }
);

forwardButton.addEventListener(
  "click",
  () => {
    window.browserAPI.goForward();
  }
);

reloadButton.addEventListener(
  "click",
  () => {
    window.browserAPI.reload();
  }
);

newTabButton.addEventListener(
  "click",
  () => {
    window.browserAPI.createTab();
  }
);

saveSourceButton.addEventListener(
  "click",
  () => {
    saveCurrentSource();
  }
);

showNotesButton.addEventListener("click", showNotesPage);
newNoteButton.addEventListener("click", () => openNoteEditor());
createFirstNoteButton.addEventListener("click", () => openNoteEditor());
closeNoteEditorButton.addEventListener("click", closeNoteEditor);
cancelNoteButton.addEventListener("click", closeNoteEditor);
returnToBrowserFromNotesButton.addEventListener("click", showBrowserPage);
noteForm.addEventListener("submit", saveNote);
noteEditor.addEventListener("click", (event) => {
  if (event.target === noteEditor) closeNoteEditor();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !noteEditor.classList.contains("hidden")) closeNoteEditor();
});

showSourcesButton.addEventListener(
  "click",
  () => {
    showSourcesPage();
  }
);

returnToBrowserButton.addEventListener(
  "click",
  () => {
    showBrowserPage();
  }
);

browserSidebarButton.addEventListener(
  "click",
  () => {
    showBrowserPage();
  }
);

showWorkspacesButton.addEventListener(
  "click",
  () => {
    window.browserAPI.showWorkspaceSelection();
  }
);

window.browserAPI.onPageUpdated(
  (pageData) => {
    if (pageData.tabId !== activeTabId) {
      return;
    }

    addressBar.value = pageData.url || "";

    const pageTitle =
      pageData.title || "Neuer Tab";

    document.title =
      pageTitle + " - Research Browser";

    backButton.disabled =
      !pageData.canGoBack;

    forwardButton.disabled =
      !pageData.canGoForward;

    if (!pageData.hasPage) {
  startSearchInput.value = "";
  addressBar.value = "";

  if (
    sourcesPage.classList.contains(
      "hidden"
    ) &&
    notesPage.classList.contains(
      "hidden"
    )
  ) {
    startPage.classList.remove(
      "hidden"
    );

    addressBar.focus();
    addressBar.select();
  }

  return;
}

startPage.classList.add("hidden");
  }
);

window.browserAPI.onLoadingChanged(
  (isLoading) => {
    loadingBar.classList.toggle(
      "active",
      isLoading
    );

    reloadButton.classList.toggle(
      "loading",
      isLoading
    );

    if (isLoading) {
      reloadButton.setAttribute(
        "aria-label",
        "Webseite wird geladen"
      );

      reloadButton.title =
        "Webseite wird geladen";
    } else {
      reloadButton.setAttribute(
        "aria-label",
        "Neu laden"
      );

      reloadButton.title = "Neu laden";
    }
  }
);

window.browserAPI.onTabsUpdated(
  (tabData) => {
    renderTabs(tabData);
  }
);
window.browserAPI.onFocusAddressBar(
  () => {
    addressBar.focus();
    addressBar.select();
  }
);
window.browserAPI.onActiveWorkspaceChanged(
  (workspace) => {
    if (!workspace || !workspace.name) {
      return;
    }

    activeWorkspaceName.textContent =
      workspace.name;
  }
);
window.browserAPI.browserReady();