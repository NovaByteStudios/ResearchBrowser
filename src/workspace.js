const workspaceList =
  document.querySelector("#workspace-list");

const createWorkspaceButton =
  document.querySelector("#create-workspace-button");

const workspaceDialog =
  document.querySelector("#workspace-dialog");

const workspaceNameInput =
  document.querySelector("#workspace-name-input");

const workspaceNameError =
  document.querySelector("#workspace-name-error");

const cancelWorkspaceButton =
  document.querySelector("#cancel-workspace-button");

const saveWorkspaceButton =
  document.querySelector("#save-workspace-button");

const WORKSPACES_STORAGE_KEY =
  "research-browser-workspaces";

const ACTIVE_WORKSPACE_STORAGE_KEY =
  "research-browser-active-workspace";

const defaultWorkspaces = [
  {
    id: "workspace-1",
    name: "Fall Recherche"
  }
];

let workspaces = loadWorkspaces();

function loadWorkspaces() {
  const savedWorkspaces =
    localStorage.getItem(WORKSPACES_STORAGE_KEY);

  if (!savedWorkspaces) {
    saveWorkspaces(defaultWorkspaces);

    return [...defaultWorkspaces];
  }

  try {
    const parsedWorkspaces =
      JSON.parse(savedWorkspaces);

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

function connectWorkspaceCard(workspaceCard) {
  workspaceCard.addEventListener("click", () => {
    const workspaceId =
      workspaceCard.dataset.workspaceId;

    const workspaceName =
      workspaceCard.dataset.workspaceName;

    if (!workspaceId || !workspaceName) {
      return;
    }

    openWorkspace(
      workspaceId,
      workspaceName
    );
  });
}

function createWorkspaceCard(workspace) {
  const workspaceCard =
    document.createElement("button");

  workspaceCard.className = "workspace-card";
  workspaceCard.type = "button";

  workspaceCard.dataset.workspaceId =
    workspace.id;

  workspaceCard.dataset.workspaceName =
    workspace.name;

  const icon =
    document.createElement("span");

  icon.className = "workspace-card-icon";
  icon.textContent = "🔎";

  const information =
    document.createElement("span");

  information.className =
    "workspace-card-information";

  const title =
    document.createElement("strong");

  title.textContent = workspace.name;

  const description =
    document.createElement("small");

  description.textContent =
    "Noch keine gespeicherten Tabs";

  const arrow =
    document.createElement("span");

  arrow.className = "workspace-card-arrow";
  arrow.textContent = "→";

  information.appendChild(title);
  information.appendChild(description);

  workspaceCard.appendChild(icon);
  workspaceCard.appendChild(information);
  workspaceCard.appendChild(arrow);

  connectWorkspaceCard(workspaceCard);

  return workspaceCard;
}

function renderWorkspaces() {
  const oldWorkspaceCards =
    workspaceList.querySelectorAll(
      ".workspace-card:not(.workspace-card-new)"
    );

  for (const oldCard of oldWorkspaceCards) {
    oldCard.remove();
  }

  for (const workspace of workspaces) {
    const workspaceCard =
      createWorkspaceCard(workspace);

    workspaceList.insertBefore(
      workspaceCard,
      createWorkspaceButton
    );
  }
}

function showWorkspaceDialog() {
  workspaceNameInput.value = "";

  workspaceNameError.classList.add("hidden");
  workspaceDialog.classList.remove("hidden");

  workspaceNameInput.focus();
}

function hideWorkspaceDialog() {
  workspaceDialog.classList.add("hidden");
  createWorkspaceButton.focus();
}

function saveNewWorkspace() {
  const workspaceName =
    workspaceNameInput.value.trim();

  if (workspaceName === "") {
    workspaceNameError.classList.remove(
      "hidden"
    );

    workspaceNameInput.focus();

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

  const newWorkspaceCard =
    workspaceList.querySelector(
      `[data-workspace-id="${newWorkspace.id}"]`
    );

  if (newWorkspaceCard) {
    newWorkspaceCard.focus();
  }
}

createWorkspaceButton.addEventListener(
  "click",
  showWorkspaceDialog
);

cancelWorkspaceButton.addEventListener(
  "click",
  hideWorkspaceDialog
);

saveWorkspaceButton.addEventListener(
  "click",
  saveNewWorkspace
);

workspaceNameInput.addEventListener(
  "input",
  () => {
    workspaceNameError.classList.add(
      "hidden"
    );
  }
);

workspaceNameInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      saveNewWorkspace();
    }

    if (event.key === "Escape") {
      hideWorkspaceDialog();
    }
  }
);

workspaceDialog.addEventListener(
  "click",
  (event) => {
    if (event.target === workspaceDialog) {
      hideWorkspaceDialog();
    }
  }
);

renderWorkspaces();