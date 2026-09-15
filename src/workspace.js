const workspaceList = document.querySelector("#workspace-list");
const createWorkspaceButton = document.querySelector("#create-workspace-button");
const workspaceDialog = document.querySelector("#workspace-dialog");
const workspaceNameInput = document.querySelector("#workspace-name-input");
const workspaceNameError = document.querySelector("#workspace-name-error");
const cancelWorkspaceButton = document.querySelector("#cancel-workspace-button");
const saveWorkspaceButton = document.querySelector("#save-workspace-button");

const WORKSPACES_STORAGE_KEY = "research-browser-workspaces";
const ACTIVE_WORKSPACE_STORAGE_KEY = "research-browser-active-workspace";

const defaultWorkspaces = [
  {
    id: "workspace-1",
    name: "Fall Recherche"
  }
];

let workspaces = loadWorkspaces();
let openWorkspaceMenu = null;
let selectedWorkspaceId = null;
let editingWorkspaceId = null;

function createIcon(iconClass) {
  const icon = document.createElement("span");
  icon.className = `app-icon ${iconClass}`;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function loadWorkspaces() {
  const savedWorkspaces = localStorage.getItem(
    WORKSPACES_STORAGE_KEY
  );

  if (!savedWorkspaces) {
    saveWorkspaces(defaultWorkspaces);
    return [...defaultWorkspaces];
  }

  try {
    const parsedWorkspaces = JSON.parse(savedWorkspaces);

    if (!Array.isArray(parsedWorkspaces)) {
      return [...defaultWorkspaces];
    }

    return parsedWorkspaces;
  } catch (error) {
    console.error(
      "Workspaces konnten nicht gelesen werden:",
      error
    );

    return [...defaultWorkspaces];
  }
}

function saveWorkspaces(workspaceData) {
  localStorage.setItem(
    WORKSPACES_STORAGE_KEY,
    JSON.stringify(workspaceData)
  );
}

function saveActiveWorkspace(workspace) {
  localStorage.setItem(
    ACTIVE_WORKSPACE_STORAGE_KEY,
    JSON.stringify(workspace)
  );
}

function openWorkspace(workspaceId, workspaceName) {
  const workspace = {
    id: workspaceId,
    name: workspaceName
  };

  saveActiveWorkspace(workspace);
  window.browserAPI.openWorkspace(workspace);
}

function closeWorkspaceMenu() {
  if (openWorkspaceMenu) {
    openWorkspaceMenu.remove();
    openWorkspaceMenu = null;
  }

  selectedWorkspaceId = null;
}

function showWorkspaceMenu(workspace, menuButton) {
  closeWorkspaceMenu();
  selectedWorkspaceId = workspace.id;

  const menu = document.createElement("div");
  menu.className = "workspace-menu";

  const renameButton = document.createElement("button");
  renameButton.className = "workspace-menu-item";
  renameButton.type = "button";

  const renameIcon = createIcon("icon-rename");
  const renameText = document.createElement("span");
  renameText.textContent = "Umbenennen";

  renameButton.append(renameIcon, renameText);

  const divider = document.createElement("div");
  divider.className = "workspace-menu-divider";

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "workspace-menu-item workspace-menu-item-danger";
  deleteButton.type = "button";

  const deleteIcon = createIcon("icon-delete");
  const deleteText = document.createElement("span");
  deleteText.textContent = "Löschen";

  deleteButton.append(deleteIcon, deleteText);
  menu.append(renameButton, divider, deleteButton);
  document.body.appendChild(menu);

  const buttonPosition = menuButton.getBoundingClientRect();
  const menuWidth = 190;
  const distanceFromEdge = 12;

  const leftPosition = Math.max(
    buttonPosition.right - menuWidth,
    distanceFromEdge
  );

  menu.style.left = leftPosition + "px";
  menu.style.top = buttonPosition.bottom + 6 + "px";

  renameButton.addEventListener("click", () => {
    closeWorkspaceMenu();
    showRenameWorkspaceDialog(workspace);
  });

  deleteButton.addEventListener("click", () => {
    closeWorkspaceMenu();
    deleteWorkspace(workspace);
  });

  openWorkspaceMenu = menu;
}

async function deleteWorkspace(workspace) {
  const shouldDelete = window.confirm(
    `Workspace „${workspace.name}“ wirklich löschen?\n\nGespeicherte Tabs, Cookies, Cache und Website-Anmeldungen werden endgültig entfernt.`
  );

  if (!shouldDelete) {
    return;
  }

  try {
    const result = await window.browserAPI.deleteWorkspaceData(
      workspace.id
    );

    if (!result || !result.success) {
      const errorMessage = result && result.error
        ? result.error
        : "Die Workspace-Daten konnten nicht gelöscht werden.";
      window.alert(errorMessage);
      return;
    }

    workspaces = workspaces.filter(
      (item) => item.id !== workspace.id
    );
    saveWorkspaces(workspaces);

    const savedActiveWorkspace = localStorage.getItem(
      ACTIVE_WORKSPACE_STORAGE_KEY
    );

    if (savedActiveWorkspace) {
      try {
        const activeWorkspace = JSON.parse(savedActiveWorkspace);
        if (activeWorkspace.id === workspace.id) {
          localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
      }
    }

    renderWorkspaces();
  } catch (error) {
    console.error("Workspace konnte nicht gelöscht werden:", error);
    window.alert(
      "Beim Löschen ist ein Fehler aufgetreten. Der Workspace wurde nicht entfernt."
    );
  }
}

function createWorkspaceCard(workspace) {
  const workspaceCard = document.createElement("button");
  workspaceCard.className = "workspace-card";
  workspaceCard.type = "button";
  workspaceCard.dataset.workspaceId = workspace.id;
  workspaceCard.dataset.workspaceName = workspace.name;

  const iconContainer = document.createElement("span");
  iconContainer.className = "workspace-card-icon";

  const workspaceIcon = createIcon("icon-workspace");
  iconContainer.appendChild(workspaceIcon);

  const information = document.createElement("span");
  information.className = "workspace-card-information";

  const title = document.createElement("strong");
  title.textContent = workspace.name;

  const description = document.createElement("small");
  description.textContent = "Noch keine gespeicherten Tabs";

  const menuButton = document.createElement("span");
  menuButton.className = "workspace-card-menu-button";
  menuButton.title = "Workspace verwalten";
  menuButton.setAttribute("role", "button");
  menuButton.setAttribute("tabindex", "0");
  menuButton.setAttribute(
    "aria-label",
    workspace.name + " verwalten"
  );

  const moreIcon = createIcon("icon-more");
  menuButton.appendChild(moreIcon);

  information.append(title, description);
  workspaceCard.append(
    iconContainer,
    information,
    menuButton
  );

  workspaceCard.addEventListener("click", () => {
    openWorkspace(workspace.id, workspace.name);
  });

  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showWorkspaceMenu(workspace, menuButton);
  });

  menuButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      showWorkspaceMenu(workspace, menuButton);
    }
  });

  return workspaceCard;
}

function updateCreateWorkspaceIcon() {
  const iconContainer = createWorkspaceButton.querySelector(
    ".workspace-card-icon"
  );

  if (!iconContainer) {
    return;
  }

  iconContainer.replaceChildren(
    createIcon("icon-workspace-add")
  );
}

function renderWorkspaces() {
  closeWorkspaceMenu();

  const oldWorkspaceCards = workspaceList.querySelectorAll(
    ".workspace-card:not(.workspace-card-new)"
  );

  for (const oldCard of oldWorkspaceCards) {
    oldCard.remove();
  }

  for (const workspace of workspaces) {
    const workspaceCard = createWorkspaceCard(workspace);

    workspaceList.insertBefore(
      workspaceCard,
      createWorkspaceButton
    );
  }

  updateCreateWorkspaceIcon();
}

function showCreateWorkspaceDialog() {
  editingWorkspaceId = null;
  workspaceNameInput.value = "";
  workspaceNameError.classList.add("hidden");
  saveWorkspaceButton.textContent = "Workspace erstellen";
  workspaceDialog.classList.remove("hidden");
  workspaceNameInput.focus();
}

function showRenameWorkspaceDialog(workspace) {
  editingWorkspaceId = workspace.id;
  workspaceNameInput.value = workspace.name;
  workspaceNameError.classList.add("hidden");
  saveWorkspaceButton.textContent = "Änderungen speichern";
  workspaceDialog.classList.remove("hidden");
  workspaceNameInput.focus();
  workspaceNameInput.select();
}

function hideWorkspaceDialog() {
  workspaceDialog.classList.add("hidden");
  workspaceNameError.classList.add("hidden");
  editingWorkspaceId = null;
  createWorkspaceButton.focus();
}

function updateSavedActiveWorkspace(workspace) {
  const savedActiveWorkspace = localStorage.getItem(
    ACTIVE_WORKSPACE_STORAGE_KEY
  );

  if (!savedActiveWorkspace) {
    return;
  }

  try {
    const activeWorkspace = JSON.parse(savedActiveWorkspace);

    if (activeWorkspace.id === workspace.id) {
      saveActiveWorkspace(workspace);
    }
  } catch (error) {
    console.error(
      "Aktiver Workspace konnte nicht aktualisiert werden:",
      error
    );
  }
}

function saveWorkspaceDialog() {
  const workspaceName = workspaceNameInput.value.trim();

  if (workspaceName === "") {
    workspaceNameError.classList.remove("hidden");
    workspaceNameInput.focus();
    return;
  }

  if (editingWorkspaceId) {
    const workspace = workspaces.find(
      (item) => item.id === editingWorkspaceId
    );

    if (!workspace) {
      hideWorkspaceDialog();
      return;
    }

    workspace.name = workspaceName;
    saveWorkspaces(workspaces);
    updateSavedActiveWorkspace(workspace);
    renderWorkspaces();
    hideWorkspaceDialog();
    return;
  }

  const newWorkspace = {
    id: "workspace-" + Date.now(),
    name: workspaceName
  };

  workspaces.push(newWorkspace);
  saveWorkspaces(workspaces);
  renderWorkspaces();
  hideWorkspaceDialog();

  const newWorkspaceCard = workspaceList.querySelector(
    `[data-workspace-id="${newWorkspace.id}"]`
  );

  if (newWorkspaceCard) {
    newWorkspaceCard.focus();
  }
}

createWorkspaceButton.addEventListener(
  "click",
  showCreateWorkspaceDialog
);

cancelWorkspaceButton.addEventListener(
  "click",
  hideWorkspaceDialog
);

saveWorkspaceButton.addEventListener(
  "click",
  saveWorkspaceDialog
);

workspaceNameInput.addEventListener("input", () => {
  workspaceNameError.classList.add("hidden");
});

workspaceNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveWorkspaceDialog();
  }

  if (event.key === "Escape") {
    hideWorkspaceDialog();
  }
});

workspaceDialog.addEventListener("click", (event) => {
  if (event.target === workspaceDialog) {
    hideWorkspaceDialog();
  }
});

document.addEventListener("click", (event) => {
  if (
    openWorkspaceMenu &&
    !openWorkspaceMenu.contains(event.target)
  ) {
    closeWorkspaceMenu();
  }
});

window.addEventListener("resize", closeWorkspaceMenu);

renderWorkspaces();