import Game from "./game.js";

const myGame = new Game();

const openSettingsBtn = document.getElementById("open-settings");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");

const settingsDialog = document.getElementById("settings-dialog");
const openModalBtn = document.getElementById("open-settings");

openModalBtn?.addEventListener("click", () => {
	settingsDialog?.showModal();

	const saveLoadDialog = document.getElementById("save-load-dialog");

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
});
