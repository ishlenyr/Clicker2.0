import Game from "./game.js";
import saveAs from "./FileSaver.js" // from https://github.com/eligrey/FileSaver.js

const myGame = new Game();

const openSettingsBtn = document.getElementById("open-settings");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const totalStatisticsBtn = document.getElementById("statistics-btn");

const settingsDialog = document.getElementById("settings-dialog");
const saveLoadDialog = document.getElementById("save-load-dialog");

openSettingsBtn.addEventListener("click", () => {
  settingsDialog.showModal();
});

let importExportMode = '';

const fileInput = document.getElementById('file-input');
fileInput.addEventListener("change", () => {
  const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      myGame.loadGameByString(event.target.result);
      saveLoadDialog.close();
    });
    reader.readAsText(fileInput.files[0]);
}, false);

const buttonExportImport = document.getElementById('button-export-import');
buttonExportImport.addEventListener('click', () => {
  if (importExportMode === 'export') {
    const blob = new Blob([myGame.saleLoadController.getSaveString()], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'save.data');
  }
  else if (importExportMode === 'import') {
    fileInput.click();
  }
});

saveBtn.addEventListener("click", () => {
  importExportMode = 'export';
  buttonExportImport.textContent = 'Export save';
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
  importExportMode = 'import';
  buttonExportImport.textContent = 'Import save';
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

const totalStatisticsDialog = document.getElementById(
  "total-statistics-dialog"
);
totalStatisticsBtn.addEventListener("click", () => {
  myGame.timeController.updateTimePlayed();
  document.getElementById('total-games').textContent = myGame.globalStats.sessions;
  document.getElementById('total-play-time').textContent =
    myGame.timeController.getTimePlayedString(myGame.globalStats.ticksPlayed);
  document.getElementById('total-clicks').textContent = myGame.globalStats.totalEnemyClicks;
  document.getElementById('total-enemies-killed').textContent = myGame.globalStats.enemiesKilled;
  totalStatisticsDialog.showModal();
});

const slots = saveLoadDialog.getElementsByClassName("slot-container");
for (let index = 0; index < slots.length; index++) {
  slots[index].addEventListener("click", saveLoad);
}

function saveLoad(event) {
  playButtonSound();
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

const tutorialSkip = document.getElementById("skip-tutorial");
const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialStart = document.getElementById("start-tutorial");
const tutorialWelcomeMessage = document.getElementById("welcome-message");
if(localStorage.getItem('once') === null && false ) { // temporarily disabled broken tutorial

  tutorialSkip.addEventListener("click", () =>  {
    localStorage.setItem('once', '') ;
    tutorialOverlay.remove()
  });

tutorialStart.addEventListener("click", () => {
  localStorage.setItem('once', '') ;
	tutorialStart.remove();
	tutorialSkip.remove();
  tutorialWelcomeMessage.remove();
	tutorialOverlay.addEventListener("click", showTip);
});
}
else {
  tutorialOverlay.remove()
  tutorialStart.remove();
	tutorialSkip.remove();
  tutorialWelcomeMessage.remove();
}


const tooltips = document.getElementsByClassName("tooltip");
let tooltipCount = 0;

function showTip() {
  playButtonSound();
	switch (tooltipCount) {
		case 0:
			tooltips[tooltipCount].style.display = "flex";
			tooltipCount++;
			break;
		case tooltips.length:
			tooltips[tooltipCount - 1].style.display = "none";
			tooltipCount = 0;
			tutorialOverlay.remove();
			break;
		default:
			tooltips[tooltipCount - 1].style.display = "none";
			tooltips[tooltipCount].style.display = "flex";
			tooltipCount++;
			break;
	}
}

const newGameButton = document.getElementById('new-game-btn');
newGameButton.addEventListener('click', () => {
  myGame.newGame();
});

const buttons = document.getElementsByTagName('BUTTON');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', playButtonSound);
}

function playButtonSound() {
  myGame.audioController.playSoundIndependently('button_click.wav');
}

const loadingText = document.getElementById('loading-text');
const continueText = document.getElementById('continue-text');
const loadingScreen = document.getElementById('loading-screen');

setTimeout(() => {
  loadingText.style.opacity='0';
  continueText.classList.add('fade-in');
  document.addEventListener('click', clearLoadingScreen);
}, 2000);

function clearLoadingScreen() {
  document.removeEventListener('click', clearLoadingScreen);
  loadingScreen.classList.add('fade-out-anim');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
}