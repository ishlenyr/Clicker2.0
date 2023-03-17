const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', () => {
	if (window.innerHeight == screen.height) {
		document.exitFullscreen();
		return;
	}
	const elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	}
});

const fullscreenIcon = document.getElementById('fullscreen-icon');
const exitFullscreenIcon = document.getElementById('exit-fullscreen-icon');
["", "webkit", "moz", "ms"].forEach(
    prefix => document.addEventListener(prefix+"fullscreenchange", checkFullscreen, false)
);

function checkFullscreen() {
	if(document.fullscreenElement) {
		fullscreenIcon.style.visibility = 'collapse';
		exitFullscreenIcon.style.visibility = 'visible';
	}
	else {
		fullscreenIcon.style.visibility = 'visible';
		exitFullscreenIcon.style.visibility = 'collapse';
	}
}