"use strict";

const audioStorageKey = "pinoyQuizAudio";
const songStorageKey = "pinoyQuizSong";
const timeStorageKey = "pinoyQuizAudioTime";
const volumeStorageKey = "pinoyQuizVolume";
const defaultSong = "assets/music/manila-groove.mp3";
const availableSongs = [
    defaultSong,
    "assets/music/buhay-pinoy.mp3",
    "assets/music/musicmaster.mp3",
    "assets/music/paoloargento.mp3",
    "assets/music/vadim_makes_sound.mp3"
];
const audio = document.querySelector("#background-audio") || new Audio();
const audioToggle = document.querySelector("#audioToggle");
const musicSelect = document.querySelector("#musicSelector");
const volumeSlider = document.querySelector("#volumeSlider");
const volumeOutput = document.querySelector("#volume-value");

if (!audio.isConnected) {
    audio.id = "background-audio";
    audio.hidden = true;
    document.body.append(audio);
}

audio.loop = true;
audio.preload = "auto";
audio.volume = 0.5;

function updateAudioVolume(value, persist = true) {
    const parsedValue = Number(value);
    const volume = Number.isFinite(parsedValue)
        ? Math.min(1, Math.max(0, parsedValue))
        : 0.5;

    audio.volume = volume;
    if (persist) {
        localStorage.setItem(volumeStorageKey, String(volume));
    }
    if (volumeSlider) volumeSlider.value = String(volume);
    if (volumeOutput) volumeOutput.value = `${Math.round(volume * 100)}%`;
}

function normalizeSongPath(songPath) {
    return availableSongs.includes(songPath) ? songPath : defaultSong;
}

function playMusic(songPath, resumePosition = false, savedPlaybackTime = 0) {
    const selectedSong = normalizeSongPath(songPath);
    const shouldPlay = localStorage.getItem(audioStorageKey) === "ON";

    audio.pause();
    audio.currentTime = 0;
    if (!resumePosition) {
        localStorage.setItem(timeStorageKey, "0");
    }
    audio.src = selectedSong;
    audio.loop = true;
    audio.muted = !shouldPlay;

    const startSelectedTrack = () => {
        audio.removeEventListener("loadedmetadata", startSelectedTrack);
        if (resumePosition) {
            if (Number.isFinite(savedPlaybackTime) && savedPlaybackTime > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = savedPlaybackTime % audio.duration;
            }
        }

        if (shouldPlay) startPlayback();
    };

    audio.addEventListener("loadedmetadata", startSelectedTrack, { once: true });
    audio.load();

    if (audio.readyState >= 1) startSelectedTrack();

    if (musicSelect) {
        musicSelect.value = selectedSong;
    }
}

function savePlaybackPosition() {
    if (!audio.getAttribute("src") || !Number.isFinite(audio.currentTime)) return;

    localStorage.setItem(timeStorageKey, String(audio.currentTime));
}

function startPlayback() {
    audio.muted = false;
    const playback = audio.play();
    if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
            document.addEventListener("pointerdown", resumeAudioAfterGesture, { once: true });
            document.addEventListener("keydown", resumeAudioAfterGesture, { once: true });
        });
    }
}

function updateAudioState(status, persist = true) {
    const isEnabled = status === true || status === "ON";

    if (persist) {
        localStorage.setItem(audioStorageKey, isEnabled ? "ON" : "OFF");
    }

    if (audioToggle) audioToggle.checked = isEnabled;
    audio.muted = !isEnabled;

    if (isEnabled) {
        if (!audio.getAttribute("src")) {
            playMusic(localStorage.getItem(songStorageKey) || defaultSong);
        } else {
            startPlayback();
        }
    } else {
        audio.pause();
    }
}

function saveMusicSelection(songPath) {
    const selectedSong = normalizeSongPath(songPath);
    localStorage.setItem(songStorageKey, selectedSong);
    if (musicSelect) musicSelect.value = selectedSong;
}

function resumeAudioAfterGesture() {
    if (localStorage.getItem(audioStorageKey) === "ON") startPlayback();
}

if (audioToggle) {
    audioToggle.addEventListener("change", () => updateAudioState(audioToggle.checked ? "ON" : "OFF"));
}

if (musicSelect) {
    musicSelect.addEventListener("change", () => {
        saveMusicSelection(musicSelect.value);
        playMusic(musicSelect.value);
    });
}

window.addEventListener("beforeunload", savePlaybackPosition, { once: true });

if (volumeSlider) {
    volumeSlider.addEventListener("input", () => updateAudioVolume(volumeSlider.value));
}

window.addEventListener("storage", (event) => {
    if (event.key === audioStorageKey) {
        updateAudioState(event.newValue === "ON", false);
    } else if (event.key === songStorageKey && event.newValue) {
        playMusic(event.newValue);
    } else if (event.key === timeStorageKey && Number.isFinite(Number(event.newValue))) {
        if (audio.readyState >= 1 && Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = Number(event.newValue) % audio.duration;
        }
    } else if (event.key === volumeStorageKey) {
        updateAudioVolume(event.newValue ?? 0.5, false);
    }
});

function initializeAudio() {
    let selectedSong = normalizeSongPath(localStorage.getItem(songStorageKey) || defaultSong);
    const savedPlaybackTime = Number(localStorage.getItem(timeStorageKey) || 0);
    updateAudioVolume(localStorage.getItem(volumeStorageKey) ?? volumeSlider?.value ?? 0.5, false);
    if (!localStorage.getItem(songStorageKey)) {
        localStorage.setItem(songStorageKey, selectedSong);
    }

    if (musicSelect) musicSelect.value = selectedSong;
    if (!localStorage.getItem(audioStorageKey)) {
        localStorage.setItem(audioStorageKey, "OFF");
    }

    playMusic(selectedSong, true, savedPlaybackTime);
    if (audioToggle) {
        audioToggle.checked = localStorage.getItem(audioStorageKey) === "ON";
    }
}

window.audio = audio;
window.playMusic = playMusic;
window.updateAudioState = updateAudioState;
window.saveMusicSelection = saveMusicSelection;
window.addEventListener("load", initializeAudio, { once: true });
