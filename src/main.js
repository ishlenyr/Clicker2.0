import Game from "./game.js";

const myGame = new Game();

const settingsDialog = document.getElementById("settings-dialog");
const openModalBtn = document.getElementById("open-settings");
openModalBtn?.addEventListener("click", () => {
  settingsDialog?.showModal();
});
