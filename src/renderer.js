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

let activeTabId = null;
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