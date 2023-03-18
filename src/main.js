import Game from "./game.js";

const myGame = new Game();

const openSettingsBtn = document.getElementById("open-settings");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const statisticsBtn = document.getElementById("statistics-btn");

const settingsDialog = document.getElementById("settings-dialog");
const saveLoadDialog = document.getElementById("save-load-dialog");

openSettingsBtn.addEventListener("click", () => {
  settingsDialog.showModal();
});

saveBtn.addEventListener("click", () => {
  saveLoadDialog.getElementsByClassName("dialog-title")[0].textContent =
    "Save game";
  const slots = saveLoadDialog.getElementsByClassName("slot-container");
  slots[0].classList.add("slot-disabled");
  slots[0].classList.remove("slot-active");
  for (let index = 0; index < slots.length; index++) {
    if (index !== 0) {
      slots[index].classList.add("slot-active");
      slots[index].classList.remove("slot-disabled");
    }

    const saveSlot = index === 0 ? "autosave" : "save" + index;
    if (myGame.saleLoadController.isSaveSlotExists(saveSlot)) {
      const { level, time } =
        myGame.saleLoadController.getSaveSlotData(saveSlot);
      const infoFields = slots[index]
        .getElementsByClassName("slot-info")[0]
        .getElementsByTagName("SPAN");
      infoFields[0].textContent = time;
      infoFields[1].textContent = `Level ${level}`;
    }
  }

  saveLoadDialog.showModal();
});

loadBtn.addEventListener("click", () => {
  saveLoadDialog.getElementsByClassName("dialog-title")[0].textContent =
    "Load game";
  const slots = saveLoadDialog.getElementsByClassName("slot-container");

  for (let index = 0; index < slots.length; index++) {
    const saveSlot = index === 0 ? "autosave" : "save" + index;
    const infoFields = slots[index]
      .getElementsByClassName("slot-info")[0]
      .getElementsByTagName("SPAN");

    if (myGame.saleLoadController.isSaveSlotExists(saveSlot)) {
      slots[index].classList.add("slot-active");
      slots[index].classList.remove("slot-disabled");

      const { level, time } =
        myGame.saleLoadController.getSaveSlotData(saveSlot);
      infoFields[0].textContent = time;
      infoFields[1].textContent = `Level ${level}`;
    } else {
      slots[index].classList.add("slot-disabled");
      slots[index].classList.remove("slot-active");
      infoFields[0].textContent = "--:--:--";
      infoFields[1].textContent = "------";
    }
  }
  saveLoadDialog.showModal();
});

const statisticsDialog = document.getElementById("statistics-dialog");
statisticsBtn.addEventListener("click", () => {
  statisticsDialog.showModal();
});

const slots = saveLoadDialog.getElementsByClassName("slot-container");
for (let index = 0; index < slots.length; index++) {
  slots[index].addEventListener("click", saveLoad);
}

function saveLoad(event) {
  const saveSlot = event.target.id.replace("slot-", "");
  if (
    saveLoadDialog.getElementsByClassName("dialog-title")[0].textContent ===
    "Load game"
  ) {
    myGame.loadGame(saveSlot);
  } else {
    myGame.saveGame(saveSlot);
  }
  saveLoadDialog.close();
}

const audioOverlay = document.getElementById("audio-overlay");
audioOverlay.addEventListener("click", () => audioOverlay.remove());

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark");
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (event.matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });
