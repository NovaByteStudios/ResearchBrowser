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