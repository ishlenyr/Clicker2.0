import Game from "./game.js";

const myGame = new Game();

const openSettingsBtn = document.getElementById("open-settings");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const statisticsBtn = document.getElementById("statistics-btn");

const settingsDialog = document.getElementById("settings-dialog");
const saveLoadDialog = document.getElementById("save-load-dialog");
const statisticsDialog = document.getElementById("statistics-dialog");

document.onclick = () => {
  if (backMusic.paused) {
    backMusic.play();
  }
};

openSettingsBtn.addEventListener("click", () => {
  settingsDialog.showModal();
});
saveBtn.addEventListener("click", () => {
  // я питонист мне пофиг
  saveLoadDialog.childNodes[1].textContent = "Save game";
  saveLoadDialog.showModal();
});
loadBtn.addEventListener("click", () => {
  saveLoadDialog.childNodes[1].textContent = "Load game";
  saveLoadDialog.showModal();
});
statisticsBtn.addEventListener("click", () => {
  statisticsDialog.showModal();
});

const audioOverlay = document.getElementById("audio-overlay");

audioOverlay.addEventListener("click", () => audioOverlay.remove());
