const addressBar = document.querySelector(".address-bar");
const startSearchInput = document.querySelector(".search-box input");

const backButton = document.querySelector('[data-action="back"]');
const forwardButton = document.querySelector('[data-action="forward"]');
const reloadButton = document.querySelector('[data-action="reload"]');

const tabTitle = document.querySelector(".tab-title");
const loadingBar = document.querySelector(".loading-bar");

function navigate(input) {
  const cleanedInput = input.trim();

  if (cleanedInput === "") {
    return;
  }

  window.browserAPI.navigate(cleanedInput);
}

addressBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    navigate(addressBar.value);
  }
});

startSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addressBar.value = startSearchInput.value;
    navigate(startSearchInput.value);
  }
});

backButton.addEventListener("click", () => {
  window.browserAPI.goBack();
});

forwardButton.addEventListener("click", () => {
  window.browserAPI.goForward();
});

reloadButton.addEventListener("click", () => {
  window.browserAPI.reload();
});

window.browserAPI.onPageUpdated((pageData) => {
  if (pageData.url) {
    addressBar.value = pageData.url;
  }

  if (pageData.title) {
    tabTitle.textContent = pageData.title;
    document.title = `${pageData.title} - Research Browser`;
  }

  backButton.disabled = !pageData.canGoBack;
  forwardButton.disabled = !pageData.canGoForward;
});
window.browserAPI.onLoadingChanged((isLoading) => {
  loadingBar.classList.toggle("active", isLoading);
  reloadButton.classList.toggle("loading", isLoading);

  if (isLoading) {
    reloadButton.setAttribute(
      "aria-label",
      "Webseite wird geladen"
    );

    reloadButton.title = "Webseite wird geladen";
  } else {
    reloadButton.setAttribute(
      "aria-label",
      "Neu laden"
    );

    reloadButton.title = "Neu laden";
  }
});