const playlist = [
    { title: 'A Corpse in My Arms on Awakening', artist: 'Bull of Heaven', src: 'assets/044_Excerpt.mp3' },
    { title: 'Get OFF My Colony!', artist: 'Ministry of Entertainment', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'GOVERNMENT APPROVED TRACK #3', artist: 'Ministry of Entertainment', src: 'track3.mp3' }
];

const audio = document.getElementById('player');
audio.src = playlist[0].src;
const playPauseBtn = document.querySelector('.play-pause');
const playIcon = playPauseBtn.querySelector('.icon');

const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const currentTimeEl = document.querySelector('.current');
const durationEl = document.querySelector('.duration');
const audioNameEl = document.querySelector('.audioname');
const audioArtistEl = document.querySelector('.artistname');
const speedTrackEl = document.querySelector('.tracknext');
const slowTrackEl = document.querySelector('.trackprevious');

var speed = 1;

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    audioNameEl.textContent = playlist[0].title;
    audioArtistEl.textContent = playlist[0].artist || 'Unknown Artist';
});

speedTrackEl.addEventListener('click', () => {
    if (speed < 2) {
        speed = 2;
        audio.playbackRate = speed;
    } else if (speed === 2) {
        speed = 1;
        audio.playbackRate = speed;
    }
});

slowTrackEl.addEventListener('click', () => {
    if (speed > 0.5) {
        speed = 0.5;
        audio.playbackRate = speed;
    } else if (speed === 0.5) {
        speed = 1;
        audio.playbackRate = speed;
    }
});

audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.textContent = '⏸';
    } else {
        audio.pause();
        playIcon.textContent = '▶';
    }
});

progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
});